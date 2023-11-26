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
import { AuthGuard } from '../common';
import { Story } from '@prisma/client';
import { StoryDto } from 'src/story/dto';
import { Request } from 'express';
import { EditStory } from './dto';
import { RequestsService } from 'src/requests/requests.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly requestService: RequestsService) {}

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
    this.requestService.incrementRequest('/user/editLore', 'PATCH');
    this.userService.incrementTotalRequests(request.cookies.token);
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
   this.requestService.incrementRequest('/user/userLores', 'GET');
   this.userService.incrementTotalRequests(request.cookies.token);
   return response;
  }
}
