import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request as Req,
  Response as Res,
  Session,
} from '@nestjs/common';
import { Response } from 'express';
import { UserSession } from '../common';
import { AuthService } from './auth.service';
import { UserDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User Authentication')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticating User' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully Logged-In.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: UserDto,
    description: 'User Object loaded in Session Object',
  })
  @Post('signin')
  async signIn(
    @Session() session: UserSession,
    @Body() dto: UserDto,
    @Res() response: Response,
  ) {
    try {
      // Call your authentication service to sign in the user
      await this.authService.signIn(session, dto, response);

      console.log('After the await');
    } catch (error) {
      // Handle authentication errors
      console.error('Authentication failed:', error);
      response.status(401).json({ error: 'Authentication failed.' }); // Set an appropriate HTTP status code
      return; // Return to exit the function
    }
    console.log('After try and catch ', session);
    // Return the session data in the response
    response.json({ session: session });
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creating a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiBody({
    type: UserDto,
    description: 'User Object loaded in Session Object',
  })
  @Post('signup')
  async signUp(
    @Session() session: UserSession,
    @Body() dto: UserDto,
    @Res() response: Response,
  ) {
    try {
      // Call your authentication service to sign in the user
      await this.authService.signUp(session, dto, response);

      console.log('After the await');
    } catch (error) {
      // Handle authentication errors
      console.error('Authentication failed:', error);
      response.status(401).json({ error: 'Authentication failed.' }); // Set an appropriate HTTP status code
      return; // Return to exit the function
    }
    console.log('After try and catch ', session);
    // Return the session data in the response
    response.json({ session: session });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Signing out a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been successfully signed out.',
  })
  @Get('signout')
  async signOut(@Session() session: UserSession, @Res() res: Response) {
    await this.authService.signOut(session, res);
    return { authenticated: false };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if User Authenticated' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been successfully authenticated',
  })
  @Get('status')
  status(@Session() session: UserSession) {
    const isLoggedIn = session && session.user && session.authenticated;

    if (isLoggedIn) {
      // User is logged in
      return { authenticated: true };
    } else {
      // User is not logged in
      return { authenticated: false };
    }
  }
}
