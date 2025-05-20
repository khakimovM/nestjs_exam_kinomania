import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async seedAll() {
    this.seedUsers();
  }
  async seedUsers() {
    this.logger.log('Users seeders started');
    const username = this.configService.get('USERNAME');
    const email = this.configService.get('EMAIL');
    const password = this.configService.get('PASSWORD');
    const findExistAdmin = await this.prisma.user.findFirst({
      where: { username },
    });

    if (!findExistAdmin) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await this.prisma.user.create({
        data: { username, email, password: hashedPassword, role: 'superadmin' },
      });

      this.logger.log('Users seeders ended');
    } else {
      this.logger.log('Superadmin already existed');
    }
  }
  async onModuleInit() {
    try {
      await this.seedAll();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
