import {
  Controller,
  ForbiddenException,
  Get,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, UserSession } from '../common';
import { Story } from '@prisma/client';

import { StoryService } from './story.service';
import { StoryDto } from './dto';

@ApiTags('story')
@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @UseGuards(AuthGuard)
  @Get('allStories')
  @ApiResponse({
    status: 200,
    description: 'List of all stories',
    type: StoryDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getAllStories(@Session() session: UserSession): Promise<Story[]> {
    // Assuming your service has a method to get all stories
    if (session.user.user_privilege !== 'ADMIN') {
      throw new ForbiddenException('You must be an Admin');
    }

    const response = await this.storyService.getAllStories(session.user);
    return response;
  }
}
