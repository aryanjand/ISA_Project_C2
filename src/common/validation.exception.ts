import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Constructs the HttpException with the same interface
 * as the class-validator error response.
 */
export class ValidationException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        statusCode: statusCode,
        message: [message],
        error: HttpStatus[statusCode],
      },
      statusCode,
    );
  }
}
