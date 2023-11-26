import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { OpenAiService } from '../open-ai/open-ai.service';
import { RequestsService } from '../requests/requests.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [ModelService, OpenAiService, RequestsService, UserService],
  controllers: [ModelController],
})
export class ModelModule {}
