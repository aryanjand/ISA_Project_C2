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
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ModelModule } from './model/model.module';
import { OpenAiController } from './open-ai/open-ai.controller';
import { OpenAiService } from './open-ai/open-ai.service';


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
    CloudinaryModule,
    ModelModule
  ],
  controllers: [AppController, OpenAiController],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: NotFoundExceptionFilter,
    },
    OpenAiService,
  ],
})
export class AppModule {}
