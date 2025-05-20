import { Subscription_type } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsString } from 'class-validator';

export class UpdateMovieDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(Subscription_type)
  subscription_type: Subscription_type;

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  category_ids: string[];
}
