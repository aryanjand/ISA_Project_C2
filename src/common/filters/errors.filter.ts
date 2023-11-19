import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { RouteTree } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch(HttpException)
export class ErrorsExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(exception.getStatus());

    const errorMessage = exception.getResponse() instanceof Object ? exception.getResponse()['message'] : exception.getResponse();

    return response.json({
      statusCode: exception.getStatus(),
      message: errorMessage,
    });
  }
}
