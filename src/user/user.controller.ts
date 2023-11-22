import { Controller, ForbiddenException, Get, Session } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserSession } from '../common';
import { User } from '@prisma/client';
import { UserDto } from '../auth/dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('allUser')
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: UserDto, // Replace 'User' with your actual user type
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
