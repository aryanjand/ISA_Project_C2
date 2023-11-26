import { Controller, Get } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { USER_MESSAGES } from './user/user.constants';

@ApiTags('Root')
@Controller()
export class AppController {
  @ApiOperation({ summary: USER_MESSAGES.DOCUMENTATION })
  @ApiResponse({
    status: 201,
    description: USER_MESSAGES.WELCOME,
  })
  @ApiResponse({
    status: 403,
    description: USER_MESSAGES.SOMETHING_WENT_WRONG_USER,
  })
  @Get()
  root() {
    return { message: USER_MESSAGES.WELCOME };
  }
}
