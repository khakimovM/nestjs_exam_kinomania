import { Payment_method } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSubPurchaseDTO {
  @IsString()
  plan_id: string;

  @IsEnum(Payment_method)
  payment_method: Payment_method;

  @IsOptional()
  @IsBoolean()
  auto_renew: boolean;

  @IsObject()
  payment_details: {};
}
