import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse();
    
    let errorResponseMessage: any;

    if (typeof exceptionResponse === 'string') {
      errorResponseMessage = { message: exceptionResponse, error: exception.name };
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      // If exceptionResponse is an object, like { message: '...', error: '...' }
      errorResponseMessage = exceptionResponse as any;
    } else {
      errorResponseMessage = { message: 'Internal server error', error: exception.name };
    }
    
    // Ensure 'message' property exists for consistency
    if (!errorResponseMessage.message && exception.message) {
        errorResponseMessage.message = exception.message;
    }


    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      success: false,
      ...errorResponseMessage,
    });
  }
}