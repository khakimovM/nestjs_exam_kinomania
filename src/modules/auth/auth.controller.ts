import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Res,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Response } from 'express';
import { LoginAuthDto } from './dto/loginDto';

@Controller('auth')
@SetMetadata('isFreeAuth', true)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: CreateAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, ...ans } = await this.authService.register(registerDto);
    response.cookie('token', token, {
      httpOnly: true,
      maxAge: 2.1 * 60 * 60 * 1000,
    });

    return ans;
  }

  @Post('login')
  async login(
    @Body() userData: LoginAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, ...ans } = await this.authService.login(userData);
    response.cookie('token', token, {
      httpOnly: true,
      maxAge: 2.1 * 60 * 60 * 1000,
    });

    return ans;
  }

  @Post('logout')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    return { message: 'Muvaffaqiyatli tizimdan chiqildi' };
  }
}
