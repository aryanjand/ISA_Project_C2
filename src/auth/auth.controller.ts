import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request as Req,
  Response as Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenCookie } from 'src/common/decorators/token-cookie.decorator';
import { AuthGuard } from '../common';
import { Request, Response } from 'express';
import { AUTH_MESSAGES } from '../auth/auth.constants';

@ApiTags('User Authentication')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticating User' })
  @ApiResponse({
    status: 201,
    description: AUTH_MESSAGES.SUCCESSFUL_LOGIN,
  })
  @ApiResponse({ status: 403, description: AUTH_MESSAGES.FORBIDDEN })
  @ApiBody({
    type: UserDto,
    description: 'User Object loaded in Session Object',
  })
  @Post('signin')
  async signIn(
    @Body() dto: UserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const result = await this.authService.signIn(dto, response);
      return result;
    } catch (error) {
      console.error('Authentication failed:', error);
      response.status(401).json({ error: AUTH_MESSAGES.AUTHENTICATION_FAILED });
      return;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creating a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AUTH_MESSAGES.SUCCESSFUL_SIGNUP,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: AUTH_MESSAGES.FORBIDDEN })
  @ApiBody({
    type: UserDto,
    description: 'User Object loaded in Session Object',
  })
  @Post('signup')
  async signUp(
    @Body() dto: UserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const result = await this.authService.signUp(dto, response);
      return result;
    } catch (error) {
      console.error('Authentication failed:', error);
      response.status(401).json({ error: AUTH_MESSAGES.AUTHENTICATION_FAILED });
      return; 
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Signing out a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: AUTH_MESSAGES.SUCCESSFUL_SIGNOUT,
  })
  @Get('signout')
  async signOut(@TokenCookie() token: string, @Res() res: Response) {
    await this.authService.signOut(token, res);
    return;
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Check Authentication',
    description: 'Check if the user is authenticated',
  })
  @HttpCode(HttpStatus.OK)
  @Get('session')
  @Get('session')
  async session(@Req() request: Request) {
    try {
      console.log('request in controller ', request.cookies.token);
      const result = await this.authService.session(request.cookies.token);
      return result;
    } catch (error) {
      console.error('Error in session endpoint:', error.message);
      return { error: AUTH_MESSAGES.ERROR_PROCESSING_REQUEST };
    }
  }
}
