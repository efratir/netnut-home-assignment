import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SCRAPE_QUEUE } from '@scraper/shared';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

@Module({
  imports: [BullModule.registerQueue({ name: SCRAPE_QUEUE })],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
