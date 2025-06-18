import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassValidationPipe } from './common/pipes/class-validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.enableCors(); // Configure as needed for production

  app.useGlobalPipes(
    new ClassValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ad Manager - Analytics & Reporting API')
    .setDescription('API endpoints for advertising performance reports and analytics.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs/analytics', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('ANALYTICS_API_PORT') || 3004;

  await app.listen(port);
  console.log(`Analytics Reporting API is running on: ${await app.getUrl()}`);
}
bootstrap();