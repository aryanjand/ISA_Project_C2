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
    const route: RouteTree = request.route;

    response.status(exception.getStatus());

    return response.render(route.path.split('/')[1], {
      errors: exception.getResponse()['message'],
    });
  }
}
