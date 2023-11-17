import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { cwd } from 'process';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

import { NotFoundExceptionFilter } from './common';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(cwd(), '.env'),
    }),
    HttpModule,
    PrismaModule,
    HealthModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: NotFoundExceptionFilter,
    },
  ],
})
export class AppModule {}
