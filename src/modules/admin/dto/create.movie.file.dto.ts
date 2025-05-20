import { Quality } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateMovieFileDto {
  @IsString()
  language: string;

  @IsEnum(Quality)
  quality: Quality;
}
