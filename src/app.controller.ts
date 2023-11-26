import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { USER_MESSAGES } from './user/user.constants';

@ApiTags('Root')
@Controller()
export class AppController {
  @Get()
  root() {
    return { message: USER_MESSAGES.WELCOME };
  }
}
