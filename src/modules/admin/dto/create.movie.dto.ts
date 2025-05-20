import { Subscription_type } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Type(() => Number)
  release_year: number;

  @IsNumber()
  @Type(() => Number)
  duration_minute: number;

  @IsEnum(Subscription_type)
  subscription_type: Subscription_type;

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  category_ids: string[];
}
