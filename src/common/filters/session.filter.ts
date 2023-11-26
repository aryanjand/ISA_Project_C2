import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { FILTER_MESSAGE } from './filters.constants';

@Catch(HttpException)
export class SessionExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException
    ) {
      return response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: exception.getResponse()['message'] || FILTER_MESSAGE.UNAUTHORIZED,
      });
    }
  }
}
