import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Response as Res,
  Session,
} from '@nestjs/common';
import { Response } from 'express';
import { UserSession } from '../common';
import { AuthService } from './auth.service';
import { UserDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User Authentication')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticating User' })
  @ApiResponse({ status: 201, description: 'User has been successfully Logged-In.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: UserDto,
    description: 'User Object loaded in Session Object',
  })
  @Post('signin')
  async signIn(
    @Session() session: UserSession,
    @Body() dto: UserDto,
  ) {
    try {
      // Call your authentication service to sign in the user
      await this.authService.signIn(session, dto);
  
      // Return the session data in the response
      return { session: session };
    } catch (error) {
      // Handle authentication errors
      return { error: 'Authentication failed.' };
    }
  }
  

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creating a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User has been successfully created.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiBody({
    type: UserDto,
    description: 'User Object loaded in Session Object',
  })
  @Post('signup')
  async signUp(
    @Session() session: UserSession,
    @Body() dto: UserDto,
  ) {
    try {
      // Call your authentication service to sign in the user
      await this.authService.signUp(session, dto);

      // Return the session data in the response
      return { session: session };
    } catch (error) {
      // Handle authentication errors
      return { error: 'Authentication failed.' };
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Signing out a user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User has been successfully signed out.' })
  @Get('signout')
  signOut(@Session() session: UserSession, @Res() res: Response) {
    return this.authService.signOut(session, res);
  }
}


