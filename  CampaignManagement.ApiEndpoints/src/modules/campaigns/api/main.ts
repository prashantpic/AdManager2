import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CampaignsApiModule } from './campaigns.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(CampaignsApiModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService); // Get ConfigService instance

  // Global Prefix
  app.setGlobalPrefix('api');

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted values are provided
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allow conversion of string path/query params to numbers/booleans
      },
    }),
  );

  // Global Filters - HttpAdapterHost is required by AllExceptionsFilter constructor
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));


  // Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ad Manager - Campaign Management API')
    .setDescription('API endpoints for managing advertising campaigns, ad sets, ads, creatives, and A/B tests.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for @ApiBearerAuth('JWT-auth')
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
        persistAuthorization: true, // Persist authorization in Swagger UI
    },
    customSiteTitle: 'Campaign Management API Docs',
  });

  // CORS
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  if (corsOrigin) {
    app.enableCors({
      origin: corsOrigin.split(','), // Allow multiple origins from comma-separated string
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization, Accept, X-Requested-With',
    });
    logger.log(`CORS enabled for origins: ${corsOrigin}`);
  } else {
    app.enableCors(); // Default permissive CORS if not specified
    logger.warn('CORS_ORIGIN not set, using default permissive CORS settings.');
  }


  // Port Configuration
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  logger.log(`Campaign Management API is running on: ${await app.getUrl()}/api/docs`);
}
bootstrap().catch(err => {
    const logger = new Logger('Bootstrap-Error');
    logger.error(`Failed to bootstrap the application: ${err}`, err.stack);
    process.exit(1);
});