import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('app.port') || 3000;
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';
  const apiVersion = configService.get<string>('app.apiVersion') || 'v1';
  const environment = configService.get<string>('app.environment') || 'development';

  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors(); // Or configure CORS more restrictively

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ad Manager Data Governance & Compliance API')
    .setDescription('API endpoints for managing data governance, consent, DSR, retention, and compliance.')
    .setVersion('1.0') // This is swagger doc version, not API version from config for path
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // Path for swagger is /api/v1/data-governance/docs as per SDS section 8
  SwaggerModule.setup(`${apiPrefix}/${apiVersion}/data-governance/docs`, app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${apiPrefix}/${apiVersion}/data-governance/docs (Environment: ${environment})`,
    'Bootstrap',
  );
}
bootstrap();