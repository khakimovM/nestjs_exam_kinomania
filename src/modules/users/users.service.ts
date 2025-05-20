import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';
import { ChangeRoleDto } from './dto/change-role.dto';
import path from 'path';
import deleteFile from 'src/common/utils/delete.file';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(createUserDto: CreateAuthDto) {
    let result = await this.prisma.user.create({
      data: createUserDto,
      select: { id: true, username: true, role: true, createdat: true },
    });
    return result;
  }

  async findByUsername(username: string) {
    return await this.prisma.user.findFirst({ where: { username } });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findFirst({ where: { email } });
  }

  async findById(id: string) {
    return await this.prisma.user.findFirst({ where: { id } });
  }

  async getAllUsers() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        full_name: true,
        phone: true,
        country: true,
        createdat: true,
        avatar_url: true,
      },
    });
  }

  async updateProfile(userData: UpdateUserDto, avatar_url: string, id: string) {
    if (userData.username) {
      const checkUsername = await this.findByUsername(userData.username);
      if (checkUsername && checkUsername.id !== id)
        throw new ConflictException('Username already existed');
    }

    if (userData.email) {
      const checkEmail = await this.findByEmail(userData.email);
      if (checkEmail && checkEmail.id !== id)
        throw new ConflictException('Email already existed');
    }

    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      userData.password = hashedPassword;
    }

    const oldUser = await this.prisma.user.findFirst({ where: { id } });
    let file_url = oldUser?.avatar_url;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { ...userData, avatar_url },
      select: {
        id: true,
        full_name: true,
        phone: true,
        country: true,
        updatedat: true,
      },
    });

    const filePath = path.join(
      process.cwd(),
      'uploads/avatars',
      file_url ?? '',
    );
    console.log(filePath);

    await deleteFile(filePath);
    return { message: 'Profil muvaffaqiyatli yangilandi', data: updatedUser };
  }

  async changeRole(roleData: ChangeRoleDto, id: string) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) throw new NotFoundException('User nor found');

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: roleData,
      select: {
        username: true,
        email: true,
        updatedat: true,
        role: true,
        full_name: true,
      },
    });

    return { message: 'User successfull updated', data: updatedUser };
  }
}
