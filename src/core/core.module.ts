import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SeederModule } from './database/seeders/seeder.module';

@Module({
  imports: [
    DatabaseModule,
    SeederModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_KEY'),
        signOptions: { expiresIn: '2h' },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CoreModule {}
