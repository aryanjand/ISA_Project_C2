import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return { message: 'Hello world!' };
  }

  @Get('signup')
  @Render('signup')
  signup() {
    return { errors: [] };
  }

  @Get('signin')
  @Render('signin')
  signin() {
    return { errors: [] };
  }
}
