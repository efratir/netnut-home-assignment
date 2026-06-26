import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateJobDto, JobResponseDto } from '@scraper/shared';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() dto: CreateJobDto): Promise<JobResponseDto> {
    return this.jobsService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<JobResponseDto> {
    return this.jobsService.findOne(id);
  }
}
