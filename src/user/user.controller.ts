import { Controller, ForbiddenException, Get, Session } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserSession } from '../common';
import { Story, User } from '@prisma/client';
import { UserDto } from '../auth/dto';
import { StoryDto } from 'src/story/dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/story/:id')
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: StoryDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getStroyForUser(@Session() session: UserSession): Promise<Story[]> {
    // Assuming your service has a method to get all users
    if (session.user.user_privilege !== 'ADMIN') {
      throw new ForbiddenException('You must be an Admin');
    }

    const response = await this.userService.getStoryForUser(session.user);
    return response;
  }

  @Get('allUser')
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: UserDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getAllUsers(@Session() session: UserSession): Promise<User[]> {
    // Assuming your service has a method to get all users
    if (session.user.user_privilege !== 'ADMIN') {
      throw new ForbiddenException('You must be an Admin');
    }

    const response = await this.userService.getAllUsers(session.user);
    return response;
  }
}
