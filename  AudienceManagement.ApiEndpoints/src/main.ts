import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'; // Assuming this filter exists

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api'); // Global prefix for all routes

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert query/path params to expected types
      },
    }),
  );

  // app.useGlobalFilters(new AllExceptionsFilter()); // Enable global exception filter

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Ad Manager - Audience Management API')
    .setDescription('API endpoints for managing advertising audiences (custom, lookalike) and their synchronization with ad networks.')
    .setVersion('1.0')
    .addTag('Audiences', 'Operations related to audience management')
    .addBearerAuth( // Configuration for JWT Bearer Token in Swagger UI
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header'
      },
      'jwt', // This name is used to apply the auth scheme to endpoints
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/audience-management/docs', app, document);

  const port = process.env.PORT || 3002; // Example port, configure as needed
  await app.listen(port);
  logger.log(`Audience Management API is running on: ${await app.getUrl()}/api/v1/audience-management/docs`);
}
bootstrap();