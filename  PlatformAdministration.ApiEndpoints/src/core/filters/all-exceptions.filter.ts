import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  // HttpAdapterHost is not strictly needed based on SDS section 10's example of app.useGlobalFilters(new AllExceptionsFilter());
  // If it were needed, it would be injected: constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  constructor() {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // const { httpAdapter } = this.httpAdapterHost; // Would be used if httpAdapterHost is injected

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';
    
    // Log the exception
    this.logger.error(
        `HTTP Status: ${httpStatus} Error Message: ${JSON.stringify(message)} Path: ${request.url}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );


    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: (typeof message === 'string') ? message : (message as any)?.message || message, // Handle cases where 'message' might be an object (e.g. class-validator errors)
    };
    
    // For class-validator errors, HttpException.getResponse() often returns an object like:
    // { statusCode: 400, message: ['validation error 1', 'validation error 2'], error: 'Bad Request' }
    // We want to ensure 'message' in responseBody is user-friendly.
    if (exception instanceof HttpException && typeof exception.getResponse() === 'object') {
        const exceptionResponse = exception.getResponse() as any;
        if (Array.isArray(exceptionResponse.message) && httpStatus === HttpStatus.BAD_REQUEST) {
            responseBody.message = exceptionResponse.message;
        } else if (exceptionResponse.message && typeof exceptionResponse.message === 'string') {
            responseBody.message = exceptionResponse.message;
        }
    }


    response.status(httpStatus).json(responseBody);
    // httpAdapter.reply(response, responseBody, httpStatus); // Would be used if httpAdapterHost is injected
  }
}