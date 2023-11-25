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
import { TokenCookie } from 'src/common/decorators/token-cookie.decorator';

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
    @Body() dto: UserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      // Call your authentication service to sign in the user
      const result = await this.authService.signIn(dto, response);

      console.log('After the await');
      return result;
    } catch (error) {
      // Handle authentication errors
      console.error('Authentication failed:', error);
      response.status(401).json({ error: 'Authentication failed.' }); // Set an appropriate HTTP status code
      return; // Return to exit the function
    }
    console.log('After try and catch ');
    // Return the session data in the response
    return;
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
    @Body() dto: UserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      // Call your authentication service to sign in the user
      await this.authService.signUp(dto, response);

      console.log('After the await');
    } catch (error) {
      // Handle authentication errors
      console.error('Authentication failed:', error);
      response.status(401).json({ error: 'Authentication failed.' }); // Set an appropriate HTTP status code
      return; // Return to exit the function
    }
    console.log('After try and catch ');
    // Return the session data in the response
    return;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Signing out a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been successfully signed out.',
  })
  @Get('signout')
  async signOut(@TokenCookie() token: string, @Res() res: Response) {
    await this.authService.signOut(token, res);
    return;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if User Authenticated' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been successfully authenticated',
  })
  @Get('status')
  async status(@TokenCookie() token: string) {
    console.log("token", token);
    const result = await this.authService.session(token);
    console.log("status", result);
    return result;
  }
}
