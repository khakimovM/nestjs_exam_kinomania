import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  username: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsStrongPassword()
  password: string;
}
