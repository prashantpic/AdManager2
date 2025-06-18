import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core'; // For Express/Fastify compatibility
import { ILoggerService, LogMeta } from '../../logging/interfaces/logger.service.interface';
import { BasePlatformException, IBasePlatformExceptionPayload } from '../base.exception';
import { ValidationException, VALIDATION_ERROR_CODE } from '../exceptions/validation.exception';
import { LOGGER_SERVICE_TOKEN } from '../../logging/constants/logging.constants';
import { HTTP_STATUS } from '../../common/constants/http-status.constants';

// Assuming Request type is available in the context (e.g. from express)
interface Request {
    url: string;
    method: string;
    // Potentially other properties like user, headers, etc.
}


@Catch() // Catch all exceptions
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(LOGGER_SERVICE_TOKEN) private readonly logger: ILoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    // const response = ctx.getResponse<Response>(); // Not directly used with httpAdapter

    let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred.';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let details: Record<string, any> | string[] | undefined = undefined;
    let validationErrors: Record<string, string[]> | string[] | undefined = undefined;

    const logMeta: LogMeta = {
        path: request.url,
        method: request.method,
        // Potentially add user context if available from request (e.g., req.user)
    };

    if (exception instanceof BasePlatformException) {
      status = exception.getStatus();
      const responsePayload = exception.getResponse() as Partial<IBasePlatformExceptionPayload> | string;
      if (typeof responsePayload === 'string') {
        message = responsePayload;
      } else {
        message = responsePayload.message || message;
        // errorCode is derived from exception.errorCode below
        details = responsePayload.details;
      }
      errorCode = exception.errorCode; // Prefer this from the custom exception
      
      if (exception instanceof ValidationException) {
        validationErrors = exception.validationErrors;
        // The details from BasePlatformException might already contain this if passed in constructor
      }
      this.logger.warn(`Handled Platform Exception: ${message}`, request.url, { ...logMeta, errorCode, status, details: exception.details, stack: exception.stack });

    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responsePayload = exception.getResponse();
      if (typeof responsePayload === 'string') {
        message = responsePayload;
      } else if (typeof responsePayload === 'object' && responsePayload !== null) {
        message = (responsePayload as any).message || message;
        // HttpException might have its own structure for 'error' or other fields
        errorCode = (responsePayload as any).error || 'HTTP_EXCEPTION'; // Default error code for NestJS HttpException
        
        // Handle class-validator default pipe errors
        // (responsePayload as any).message can be an array of error strings
        if (Array.isArray((responsePayload as any).message) && status === HTTP_STATUS.BAD_REQUEST) {
            validationErrors = (responsePayload as any).message;
            message = "Validation failed"; // Override generic "Bad Request"
            errorCode = VALIDATION_ERROR_CODE; // Standardize error code for validation
        } else if ((responsePayload as any).validationErrors) { // Custom handling for class-validator via default pipe
            validationErrors = (responsePayload as any).validationErrors;
        }
      }
      this.logger.warn(`Handled HTTP Exception: ${message}`, request.url, { ...logMeta, errorCode, status, stack: exception.stack });
    } else if (exception instanceof Error) {
      // For generic Error objects not caught by above
      message = exception.message;
      this.logger.error(exception, exception.stack, request.url, logMeta );
    }
     else {
      // For non-Error objects thrown (e.g., strings, numbers)
      message = 'An unknown error occurred.';
      this.logger.error(`Unhandled Unknown Exception: ${String(exception)}`, undefined, request.url, logMeta);
    }

    const errorResponse: IBasePlatformExceptionPayload & { validationErrors?: any } = {
      statusCode: status,
      message,
      errorCode,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()), // Use HttpAdapter to get URL
      details, // From BasePlatformException
    };

    if (validationErrors) {
      errorResponse.validationErrors = validationErrors;
    }
    
    // Clean up undefined details to avoid `details: undefined` in response
    if (errorResponse.details === undefined) {
        delete errorResponse.details;
    }

    httpAdapter.reply(ctx.getResponse(), errorResponse, status);
  }
}