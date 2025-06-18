import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core'; // Preferred way to get httpAdapter
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      method: httpAdapter.getRequestMethod(request),
      message: 'Internal server error', // Default message
      error: 'Internal Server Error', // Default error type
    };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      errorResponse.message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;
      errorResponse.error = (exceptionResponse as any).error || exception.name;
    } else if (exception instanceof Error) {
        errorResponse.message = exception.message;
        errorResponse.error = exception.name;
    }


    this.logger.error(
      `HTTP Status: ${httpStatus} Error Message: ${JSON.stringify(errorResponse.message)} Path: ${errorResponse.path} Method: ${errorResponse.method}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
      AllExceptionsFilter.name,
    );
    
    // For class-validator errors, message might be an array
    if (httpStatus === HttpStatus.BAD_REQUEST && Array.isArray(errorResponse.message)) {
        // Use the array directly or format it as a single string
        // errorResponse.message = (errorResponse.message as string[]).join(', ');
    }


    httpAdapter.reply(response, errorResponse, httpStatus);
  }
}