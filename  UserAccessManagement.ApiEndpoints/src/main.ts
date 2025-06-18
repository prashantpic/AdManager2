```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Enable CORS - Configure appropriately for production
  // Example: app.enableCors({ origin: configService.get('CORS_ORIGIN') });
  app.enableCors();

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties not defined in DTOs
    transform: true, // Automatically transform payload objects to DTO instances
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    transformOptions: {
      enableImplicitConversion: true, // Allow conversion of path/query params to expected types
    },
  }));

  // Set global API prefix
  const globalPrefix = 'api/v1'; // As per SDS implied structure and good practice
  app.setGlobalPrefix(globalPrefix);

  // Swagger Setup
  const swaggerDocPath = 'docs/user-access'; // Path relative to global prefix
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Ad Manager - User Access API')
    .setDescription('API endpoints for managing users, roles, and permissions within the Ad Manager platform.')
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
      'access-token', // This name must match the one used in @ApiBearerAuth() in controllers
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(swaggerDocPath, app, document);

  // Listen on port
  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);

  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Swagger documentation available at: ${await app.getUrl()}/${swaggerDocPath}`);
}
bootstrap();
```