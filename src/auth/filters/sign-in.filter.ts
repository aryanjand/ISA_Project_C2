import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class SignInExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.getStatus());

    if (exception.getResponse()['message'] === 'Invalid credentials') {
      return response.render('signin', {
        errors: [exception.getResponse()['message']],
      });
    }

    return response.render('signin', {
      errors: exception.getResponse()['message'],
    });
  }
}
