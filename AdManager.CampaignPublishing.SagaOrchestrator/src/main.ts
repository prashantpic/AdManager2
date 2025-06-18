import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Automatically remove non-whitelisted properties
    transform: true, // Automatically transform payloads to DTO instances
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
  }));

  // Port configuration could come from ConfigService if needed
  const port = process.env.PORT || configService.get<number>('APP_PORT') || 3000;
  await app.listen(port);
  logger.log(`AdManager.CampaignPublishing.SagaOrchestrator microservice running on port ${port}`);
}
bootstrap();