import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  PrismaService,
  SCRAPE_QUEUE,
  ScrapeJobPayload,
} from '@scraper/shared';
import { ScraperService } from './scraper.service';
import { AxiosError } from 'axios';

@Processor(SCRAPE_QUEUE)
export class ScraperProcessor extends WorkerHost {
  private readonly logger = new Logger(ScraperProcessor.name);

  constructor(
    private readonly scraperService: ScraperService,
    private readonly DBPrisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<ScrapeJobPayload>): Promise<void> {
    const { jobId, url } = job.data;
    this.logger.log(`Processing job ${jobId}: ${url}`);

    await this.DBPrisma.job.update({
      where: { id: jobId },
      data: { status: 'PROCESSING' },
    });

    try {
      const html = await this.scraperService.fetchHtml(url);
      await this.DBPrisma.job.update({
        where: { id: jobId },
        data: { status: 'DONE', html },
      });
      this.logger.log(`Job ${jobId} completed (${html.length} bytes)`);
    } catch (err: unknown) {
      const error = err instanceof AxiosError ? err.message : String(err);
      await this.DBPrisma.job.update({
        where: { id: jobId },
        data: { status: 'FAILED', error },
      });
      this.logger.error(`Job ${jobId} failed: ${error}`);
    }
  }
}
