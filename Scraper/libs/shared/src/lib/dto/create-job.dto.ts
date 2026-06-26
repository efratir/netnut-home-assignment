import { IsUrl } from 'class-validator';

export class CreateJobDto {
  @IsUrl({}, { message: 'url must be a valid URL' })
  url!: string;
}
