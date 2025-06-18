import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './core/filters/all-exceptions.filter';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not defined in DTO
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allows @Type decorator to work without explicit @Type(() => Number) for query params in some cases
      },
    }),
  );

  // Global Filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // API Prefix
  const apiPrefix = configService.get<string>('apiPrefix');
  app.setGlobalPrefix(apiPrefix);

  // Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ad Manager - Platform Administration API')
    .setDescription('API endpoints for managing the Ad Manager platform.')
    .setVersion('1.0')
    .addBearerAuth() // If JWT is expected for Swagger UI interaction
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  // Port Listening
  const port = configService.get<number>('port');
  await app.listen(port);
  Logger.log(`Application is running on: ${await app.getUrl()}`, 'Bootstrap');
  Logger.log(`Swagger documentation available at: ${await app.getUrl()}/${apiPrefix}/docs`, 'Bootstrap');
}
bootstrap();