import { Controller, Get, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Root")
@Controller()
export class AppController {
  @Get()
  root() {
    return { message: 'Welcome to PicaWord!' };
  }

}
