import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from './logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine HTTP status code
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Log the error with custom logger
    const errorResponse = {
      timestamp: new Date().toISOString(),
      path: request.url,
      message: (exception instanceof HttpException)
        ? exception.getResponse()
        : 'Internal server error',
    };

    this.loggerService.logError(
      `Error ${status}: ${JSON.stringify(errorResponse)}`,
      exception instanceof Error ? exception.stack : '',
    );

    console.error('Error capturado por GlobalExceptionFilter:', exception);

    response.status(status).json(errorResponse);
  }
}
