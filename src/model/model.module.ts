import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { OpenAiService } from '../open-ai/open-ai.service';

@Module({
  providers: [ModelService, OpenAiService],
  controllers: [ModelController]
})
export class ModelModule {}
