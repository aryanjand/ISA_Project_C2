import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { RequestsService } from 'src/requests/requests.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [StoryController],
  providers: [StoryService, RequestsService, UserService],
})
export class StoryModule {}
