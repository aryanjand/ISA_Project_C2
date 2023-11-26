import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { RequestsService } from 'src/requests/requests.service';

@Module({
  controllers: [StoryController],
  providers: [StoryService, RequestsService],
})
export class StoryModule {}
