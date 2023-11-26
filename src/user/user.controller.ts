import {
  Controller,
  Get,
  UseGuards,
  Request as Req,
  HttpStatus,
  HttpCode,
  Patch,
  ForbiddenException
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, UserSession } from '../common';
import { Story, User } from '@prisma/client';
import { StoryDto } from 'src/story/dto';
import { Request } from 'express';
import { EditStory } from './dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticating User' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully Logged-In.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: EditStory,
    description: 'User Object loaded in Session Object',
  })
  @Patch('editLore')
  async editStory(@Req() request: Request): Promise<boolean> {
    const { story_id, story_text } = request.body;
    const response = await this.userService.updateStory(story_id, story_text, request.cookies.token);
    if (!response) {
      throw new ForbiddenException('Forbidden');
    }
    return response;
  }

  @UseGuards(AuthGuard)
  @Get('/userLores')
  @ApiResponse({
    status: 200,
    description: 'List of all stories for a user.',
    type: StoryDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getStoryForUser(@Req() request: Request): Promise<Story[]> {
   const user = await this.userService.getUserID(request.cookies.token);
   const response = await this.userService.getStoryForUser(user);
   return response;
  }
}
