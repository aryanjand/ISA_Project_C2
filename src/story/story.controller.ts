import {
  Controller,
  ForbiddenException,
  Get,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags} from '@nestjs/swagger';
import { AuthGuard, UserSession } from '../common';
import { Story } from '@prisma/client';
import { StoryService } from './story.service';
import { StoryDto } from './dto';
import { Request } from 'express';
import {Request as Req} from '@nestjs/common';

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
  async getAllStories(@Req() request: Request): Promise<Story[]> {
    // Assuming your service has a method to get all stories
    console.log('request JASON', request.cookies.tokens);
    return null;
    // if (session.user.user_privilege !== 'ADMIN') {
    //   throw new ForbiddenException('You must be an Admin');
    // }

    // const response = await this.storyService.getAllStories(session.user);
    // return response;
  }
}
