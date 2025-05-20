import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsJSON,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSubscriptionPlansDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  duration_days: number;

  @IsJSON()
  @Transform(({ value }) => JSON.stringify(value))
  features: any;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
