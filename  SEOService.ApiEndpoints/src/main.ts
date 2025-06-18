import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Global prefix
  // As per SDS, controller path is 'api/v1/seo', so no global prefix here,
  // but individual controllers will define their base paths.

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties not defined in DTOs.
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present.
      transform: true, // Automatically transforms incoming payloads to DTO instances.
      transformOptions: {
        enableImplicitConversion: true, // Allows for implicit type conversion
      },
    }),
  );

  // Swagger (OpenAPI) Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Ad Manager SEO Service API')
    .setDescription('API endpoints for SEO management features.')
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
      'JWT-auth', // This name here is important for matching with @ApiBearerAuth('JWT-auth') in controllers
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/seo/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Persist authorization in Swagger UI
    },
  });

  // Enable CORS (optional, configure as needed)
  app.enableCors();

  // Port Configuration
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
  logger.log(`Swagger UI available at http://localhost:${port}/api/v1/seo/docs`);
}

bootstrap().catch(err => {
  const logger = new Logger('Bootstrap-Error');
  logger.error('Failed to bootstrap the application', err.stack);
  process.exit(1);
});