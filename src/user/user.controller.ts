import {
  Controller,
  Get,
  UseGuards,
  Request as Req,
  HttpStatus,
  HttpCode,
  Patch,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../common';
import { Story } from '@prisma/client';
import { StoryDto } from 'src/story/dto';
import { Request } from 'express';
import { EditStory } from './dto';
import { RequestsService } from 'src/requests/requests.service';
import { USER_MESSAGES } from './user.constants';
import { STORY_MESSAGES } from 'src/story/story.constants';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly requestService: RequestsService,
  ) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: STORY_MESSAGES.EDITS_STROY })
  @ApiResponse({
    status: 201,
    description: STORY_MESSAGES.EDITS_STROY,
  })
  @ApiResponse({ status: 403, description: STORY_MESSAGES.FORBIDDEN_STORY })
  @ApiBody({
    type: Request,
    description: STORY_MESSAGES.REQUEST_OBJECT,
  })
  @Patch('editLore')
  async editStory(@Req() request: Request): Promise<boolean> {
    const { story_id, story_text } = request.body;
    const response = await this.userService.updateStory(
      story_id,
      story_text,
      request.cookies.token,
    );
    if (!response) {
      throw new ForbiddenException(USER_MESSAGES.FORBIDDEN);
    }
    this.requestService.incrementRequest('/user/editLore', 'PATCH');
    this.userService.incrementTotalRequests(request.cookies.token);
    return response;
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: STORY_MESSAGES.GENERATE_STORY })
  @Get('/userLores')
  @ApiResponse({
    status: 200,
    description: 'List of all stories for a user.',
    type: StoryDto,
  })
  @ApiForbiddenResponse({ status: 200, description: USER_MESSAGES.FORBIDDEN })
  async getStoryForUser(@Req() request: Request): Promise<Story[]> {
    const user = await this.userService.getUserID(request.cookies.token);
    const response = await this.userService.getStoryForUser(user);
    this.requestService.incrementRequest('/user/userLores', 'GET');
    this.userService.incrementTotalRequests(request.cookies.token);
    return response;
  }
}
