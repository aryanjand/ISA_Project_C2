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
import { Response } from 'express';
import {
  AuthGuard,
  ErrorsExceptionFilter,
  UserSession
} from '../common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User Authentication')
@UseGuards(AuthGuard)
@Controller()
export class AuthController {
  constructor(private authService: AuthService) { }
  

  @ApiOperation({ summary: 'Request to load Sign-In Page' })
  @ApiResponse({ status: 200, description: 'Sign-Page Successfully loaded' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('signin')
  signin() {
    return { errors: [] };
  }

  @UseFilters(ErrorsExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticating User' })
  @ApiResponse({ status: 201, description: 'User has been successfully Logged-In.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: SignInDto,
    description: 'User Object loaded in Session Object',
  })
  @Post('signin')
  async signIn(
    @Session() session: UserSession,
    @Res() res: Response,
    @Body() dto: SignInDto,
  ) {
    await this.authService.signIn(session, dto);
    return res.redirect('/');
  }
  

  @ApiOperation({ summary: 'Request to load Sign-Up Page' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sign-Up Page Successfully loaded' })
  @Get('signup')
  signup() {
    return { errors: [] };
  }

  @UseFilters(ErrorsExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creating a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User has been successfully created.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiBody({
    type: SignUpDto,
    description: 'JSON structure for user object',
  })
  @Post('signup')
  async signUp(
    @Session() session: UserSession,
    @Res() res: Response,
    @Body() dto: SignUpDto,
  ) {
    await this.authService.signUp(session, dto);
    return res.redirect('/');
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Signing out a user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User has been successfully signed out.' })
  @Get('signout')
  signOut(@Session() session: UserSession, @Res() res: Response) {
    return this.authService.signOut(session, res);
  }
}
