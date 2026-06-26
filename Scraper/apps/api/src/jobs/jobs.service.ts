import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateJobDto, JobResponseDto } from '@scraper/shared';

@Injectable()
export class JobsService {
  private readonly jobManagerUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.jobManagerUrl = this.config.get<string>(
      'JOB_MANAGER_URL',
      'http://localhost:3001',
    );
  }

  async create(dto: CreateJobDto): Promise<JobResponseDto> {
    const { data } = await firstValueFrom(
      this.http.post<JobResponseDto>(`${this.jobManagerUrl}/jobs`, dto),
    );
    return data;
  }

  async findOne(id: string): Promise<JobResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<JobResponseDto>(`${this.jobManagerUrl}/jobs/${id}`),
      );
      return data;
    } catch (err: any) {
      if (err?.response?.status === 404) throw new NotFoundException(`Job ${id} not found`);
      throw err;
    }
  }
}
