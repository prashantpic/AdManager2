import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './v1/documentation/swagger.setup';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * @class HttpExceptionFilter
 * @description Global filter to catch HTTP exceptions and format the error response.
 * Adheres to the structure outlined in SDS Section 8.1.
 */
@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any)?.message || exception.message
        : 'Internal server error';
        
    let errors: any[] | undefined = undefined;
    if (exception instanceof HttpException) {
        const responseException = exception.getResponse();
        if (typeof responseException === 'object' && responseException !== null && 'message' in responseException) {
            const msg = (responseException as any).message;
            if (Array.isArray(msg)) { // Typically from ValidationPipe
                errors = msg.map((err: string | Record<string, any>) => {
                    if (typeof err === 'string') {
                        return { message: err };
                    }
                    // Attempt to map class-validator errors if structure is known
                    // This part might need adjustment based on actual validation error structure
                    if (err.property && err.constraints) {
                         return { property: err.property, constraints: err.constraints };
                    }
                    return err; // return as is if not a simple string or known structure
                });
            }
        }
    }


    const errorResponse = {
      statusCode: status,
      message: errors ? 'Validation failed' : message, // More specific message for validation errors
      errors: errors, // Include detailed errors if available
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
        `HttpException: ${status} ${message} Path: ${request.url}`,
        exception instanceof Error ? exception.stack : undefined,
        GlobalHttpExceptionFilter.name
    );
    if (status >= 500 && !(exception instanceof HttpException)) {
        this.logger.error('Unhandled Exception:', exception, GlobalHttpExceptionFilter.name);
    }


    response.status(status).json(errorResponse);
  }
}

/**
 * Bootstraps the NestJS application.
 * Initializes global configurations, pipes, filters, and Swagger documentation.
 */
async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const port = configService.get<number>('PORT', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const apiPrefix = configService.get<string>('API_PREFIX', '/api');
  const appStoreUrl = configService.get<string>('APP_STORE_URL');

  // Enable CORS
  // TODO: Configure CORS properly from ConfigService for production
  app.enableCors(); 
  logger.log('CORS enabled with default settings. Configure for production.');

  // Set Global Prefix
  app.setGlobalPrefix(apiPrefix);
  logger.log(`Global API prefix set to: ${apiPrefix}`);

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Strips properties not defined in DTOs
      // forbidNonWhitelisted: true, // Optionally, throw error if non-whitelisted properties are present
    }),
  );
  logger.log('Global ValidationPipe configured with transform and whitelist.');

  // Global Filters
  app.useGlobalFilters(new GlobalHttpExceptionFilter(new Logger(GlobalHttpExceptionFilter.name)));
  logger.log('Global HttpExceptionFilter configured.');

  // Swagger Setup (conditional)
  if (nodeEnv !== 'production') {
    setupSwagger(app); // Path for swagger docs is '/api/v1/docs' as per swagger.setup.ts
    logger.log(`Swagger documentation setup for non-production environment.`);
    logger.log(`Swagger UI available at: http://localhost:${port}${apiPrefix}/v1/docs`);
  } else {
    logger.log('Swagger documentation is disabled in production environment.');
  }
  
  // GraphQL Setup is handled within AppModule if enabled via config

  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}${apiPrefix}`);
  logger.log(`Environment: ${nodeEnv}`);
  logger.log(`[PlatformName] App Store URL (from config): ${appStoreUrl || 'Not Set'}`);
}

bootstrap().catch(err => {
  const logger = new Logger('Bootstrap');
  logger.error('Error during application bootstrap', err);
  process.exit(1);
});