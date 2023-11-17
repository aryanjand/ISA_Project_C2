import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Response as Res,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthGuard, Public, UserSession } from '../common';
import { User as UserDecorator } from './auth.decorator';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { SignInExceptionFilter, SignUpExceptionFilter } from './filters';

@UseGuards(AuthGuard)
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseFilters(SignInExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Session() session: UserSession,
    @Res() res: Response,
    @Body() dto: SignInDto,
  ) {
    await this.authService.signIn(session, dto);
    return res.redirect('/');
  }

  @Public()
  @UseFilters(SignUpExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Res() res: Response, @Body() dto: SignUpDto) {
    await this.authService.signUp(dto);
    return res.redirect('/');
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('signout')
  signOut(@Session() session: UserSession, @Res() res: Response) {
    return this.authService.signOut(session, res);
  }


}
