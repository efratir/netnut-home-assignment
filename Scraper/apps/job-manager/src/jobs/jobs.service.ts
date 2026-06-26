import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  CreateJobDto,
  JobResponseDto,
  PrismaService,
  SCRAPE_QUEUE,
  ScrapeJobPayload,
} from '@scraper/shared';

@Injectable()
export class JobsService {
  constructor(
    private readonly DBPrisma: PrismaService,
    @InjectQueue(SCRAPE_QUEUE) private readonly scrapeQueue: Queue,
  ) {}

  async create(dto: CreateJobDto): Promise<JobResponseDto> {
    const job = await this.DBPrisma.job.create({ data: { url: dto.url } });

    const payload: ScrapeJobPayload = { jobId: job.id, url: job.url };
    await this.scrapeQueue.add('scrape', payload);

    return job;
  }

  async findOne(id: string): Promise<JobResponseDto> {
    const job = await this.DBPrisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException(`Job ${id} not found`);
    return job;
  }
}
