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
    description: 'List of all stories',
    type: StoryDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getAllStories(@Req() request: Request): Promise<Story[]> {
    const response = await this.storyService.getAllStories(
      request.cookies.token,
    );
    this.requestService.incrementRequest('/story/allStories', 'GET');
    this.userService.incrementTotalRequests(request.cookies.token);
    return response;
  }
}
