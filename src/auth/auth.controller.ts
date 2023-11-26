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
import { RequestsService } from 'src/requests/requests.service';

@ApiTags('User Authentication')
@Controller()
export class AuthController {
  constructor(private authService: AuthService, private readonly requestsService: RequestsService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: AUTH_MESSAGES.AUTH_USER })
  @ApiResponse({
    status: 201,
    description: AUTH_MESSAGES.SUCCESSFUL_LOGIN,
  })
  @ApiResponse({ status: 403, description: AUTH_MESSAGES.FORBIDDEN })
  @ApiBody({
    type: UserDto,
    description: AUTH_MESSAGES.OBJECT_LOADED_IN_SESSION,
  })
  @Post('signin')
  async signIn(
    @Body() dto: UserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      this.requestsService.incrementRequest('/signin', 'POST');
      const result = await this.authService.signIn(dto, response);
      return result;
    } catch (error) {
      console.error(AUTH_MESSAGES.AUTH_FAILED, error);
      response.status(401).json({ error: AUTH_MESSAGES.AUTHENTICATION_FAILED });
      return;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: AUTH_MESSAGES.CREATING_NEW_USER })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AUTH_MESSAGES.SUCCESSFUL_SIGNUP,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: AUTH_MESSAGES.FORBIDDEN })
  @ApiBody({
    type: UserDto,
    description: AUTH_MESSAGES.OBJECT_LOADED_IN_SESSION,
  })
  @Post('signup')
  async signUp(
    @Body() dto: UserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      this.requestsService.incrementRequest('/signup', 'POST');
      const result = await this.authService.signUp(dto, response);
      return result;
    } catch (error) {
      console.error(AUTH_MESSAGES.AUTH_FAILED, error);
      response.status(401).json({ error: AUTH_MESSAGES.AUTHENTICATION_FAILED });
      return; 
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: AUTH_MESSAGES.SIGNING_OUT_USER })
  @ApiResponse({
    status: HttpStatus.OK,
    description: AUTH_MESSAGES.SUCCESSFUL_SIGNOUT,
  })
  @Get('signout')
  async signOut(@TokenCookie() token: string, @Res() res: Response) {
    this.requestsService.incrementRequest('/signout', 'GET');
    await this.authService.signOut(token, res);
    return;
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: AUTH_MESSAGES.CHECKING_AUTHENTICATION,
    description: AUTH_MESSAGES.CHECKING_USER_IF_AUTHENTICATION,
  })
  @HttpCode(HttpStatus.OK)
  @Get('session')
  @Get('session')
  async session(@Req() request: Request) {
    try {
      this.requestsService.incrementRequest('/session', 'GET');
      const result = await this.authService.session(request.cookies.token);
      return result;
    } catch (error) {
      console.error(AUTH_MESSAGES.ERROR_IN_SESSION_ENDPOINT, error.message);
      return { error: AUTH_MESSAGES.ERROR_PROCESSING_REQUEST };
    }
  }
}
