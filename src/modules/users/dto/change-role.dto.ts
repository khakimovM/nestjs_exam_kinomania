import { Role } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class ChangeRoleDto {
  @IsEnum(Role)
  @IsString()
  role: Role;
}
