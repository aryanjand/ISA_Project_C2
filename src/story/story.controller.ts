import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, UserSession } from '../common';
import { Story } from '@prisma/client';
import { StoryService } from './story.service';
import { StoryDto } from './dto';
import { Request } from 'express';
import { Request as Req } from '@nestjs/common';
import { RequestsService } from 'src/requests/requests.service';
import { UserService } from 'src/user/user.service';
import { STORY_MESSAGES } from './story.constants';

@ApiTags('story')
@Controller('story')
export class StoryController {
  constructor(
    private readonly storyService: StoryService,
    private readonly requestService: RequestsService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('allStories')
  @ApiResponse({
    status: 200,
    description: STORY_MESSAGES.GETS_ALL_STORIES,
    type: StoryDto,
  })
  @ApiForbiddenResponse({
    status: 400,
    description: STORY_MESSAGES.FORBIDDEN_STORY,
  })
  async getAllStories(@Req() request: Request): Promise<Story[]> {
    const response = await this.storyService.getAllStories(
      request.cookies.token,
    );
    this.requestService.incrementRequest('/story/allStories', 'GET');
    this.userService.incrementTotalRequests(request.cookies.token);
    return response;
  }
}
