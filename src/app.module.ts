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
import { ModelModule } from './model/model.module';
import { OpenAiService } from './open-ai/open-ai.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { StoryModule } from './story/story.module';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { AdminService } from './admin/admin.service';
import { RequestsService } from './requests/requests.service';

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
    ModelModule,
    UserModule,
    StoryModule,
    AdminModule,
  ],
  controllers: [AppController, UserController, AdminController],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: NotFoundExceptionFilter,
    },
    OpenAiService,
    UserService,
    AdminService,
    RequestsService,
  ],
})
export class AppModule {}
