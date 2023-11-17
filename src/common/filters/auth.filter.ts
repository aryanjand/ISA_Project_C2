import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException
    ) {
      return response.redirect('/signin');
    }
  }
}
