import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/loginDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private readonly jwt: JwtService,
  ) {}
  async register(userBody: CreateAuthDto) {
    const checkUsername = await this.userService.findByUsername(
      userBody.username,
    );
    const checkEmail = await this.userService.findByEmail(userBody.email);

    if (checkEmail) throw new ConflictException('Email already existed');
    if (checkUsername) throw new ConflictException('Username already existed');

    const hashedPassword = await bcrypt.hash(userBody.password, 12);

    const user = await this.userService.createUser({
      ...userBody,
      password: hashedPassword,
    });

    const token = await this.jwt.signAsync({ userId: user.id });

    return {
      message: "Ro'yxatdan muvaffaqiyatli o'tdingiz",
      data: user,
      token,
    };
  }
  async login(userData: LoginAuthDto) {
    const user: any[] = await this.prisma.$queryRawUnsafe(
      `
      select u.id as user_id, u.username, u.password, u.role, json_build_object('plan_name', sp.name,'expires_at' ,us.end_date) as subscriptions from users u 
      left join user_subscription us on us.user_id = u.id
      left join subscription_plans sp on sp.id = us.plan_id
      where u.email = $1
      `,
      userData.email,
    );

    if (!user[0]) throw new NotFoundException('User not found');

    const { password, ...data } = user[0];

    const checkPassword = await bcrypt.compare(userData.password, password);

    if (!checkPassword)
      throw new UnauthorizedException('Email or password incorrect');

    const token = await this.jwt.signAsync({ userId: data.user_id });

    return { message: 'Muvaffaqiyatli kirildi', data, token };
  }
}
