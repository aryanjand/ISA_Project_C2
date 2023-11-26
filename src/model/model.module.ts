import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { OpenAiService } from '../open-ai/open-ai.service';
import { RequestsService } from '../requests/requests.service';

@Module({
  providers: [ModelService, OpenAiService, RequestsService],
  controllers: [ModelController],
})
export class ModelModule {}
