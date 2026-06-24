import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SCRAPE_QUEUE } from '@scraper/shared';
import { ScraperProcessor } from './scraper.processor';
import { ScraperService } from './scraper.service';

@Module({
  imports: [BullModule.registerQueue({ name: SCRAPE_QUEUE })],
  providers: [ScraperProcessor, ScraperService],
})
export class ScraperModule {}
