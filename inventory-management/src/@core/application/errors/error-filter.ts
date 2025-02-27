import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch(Error)
export class ErrorFilter extends BaseExceptionFilter {
  logger = new Logger(this.constructor.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    this.logger.error(exception.message, exception.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      response.status(status).json(exception.getResponse());
    } else {
      const error = exception as Error;

      response.status(500).json({
        statusCode: 500,
        message: error.message,
      });
    }
  }
}
