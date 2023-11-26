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
import { AuthGuard } from '../common';
import { Request, Response } from 'express';
import { AUTH_MESSAGES } from '../auth/auth.constants';
import { RequestsService } from 'src/requests/requests.service';
import { UserService } from 'src/user/user.service';

@ApiTags('User Authentication')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly requestsService: RequestsService,
    private readonly userService: UserService,
  ) {}

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
      response.json(result);
      return;
    } catch (error) {
      console.error(AUTH_MESSAGES.AUTH_FAILED, error);
      response.json({ error: AUTH_MESSAGES.AUTHENTICATION_FAILED });
      return;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: AUTH_MESSAGES.CREATING_NEW_USER })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AUTH_MESSAGES.SUCCESSFUL_SIGNUP,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: AUTH_MESSAGES.FORBIDDEN,
  })
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
      response.json({ error: AUTH_MESSAGES.AUTHENTICATION_FAILED });
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
  async signOut(@Req() request: Request, @Res() res: Response) {
    this.requestsService.incrementRequest('/signout', 'GET');
    this.userService.incrementTotalRequests(request.cookies.token);
    await this.authService.signOut(request.cookies.token, res);
    res.status(200).json({ success: true });
    return;
  }

  @ApiOperation({
    summary: AUTH_MESSAGES.CHECKING_AUTHENTICATION,
    description: AUTH_MESSAGES.CHECKING_USER_IF_AUTHENTICATION,
  })
  @HttpCode(HttpStatus.OK)
  @Get('session')
  async session(@Req() request: Request) {
    console.log(request.cookies.token);
    this.requestsService.incrementRequest('/session', 'GET');
    const result = await this.authService.session(request.cookies.token);
    this.userService.incrementTotalRequests(request.cookies.token);
    return result;
  }
}
