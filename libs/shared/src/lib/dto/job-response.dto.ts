import { JobStatus } from '@prisma/client';

export class JobResponseDto {
  id: string;
  url: string;
  status: JobStatus;
  html: string | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
}
