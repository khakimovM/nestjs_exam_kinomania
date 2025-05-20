import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;

  @IsStrongPassword()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  avatar_url: string;

  @IsString()
  @IsOptional()
  full_name: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  country: string;
}
