import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GIFT_OPTIONS_API_V1_PREFIX } from './modules/gift-options/api/v1/gift-options-api.constants';

async function bootstrap() {
  // 1. Create NestJS application instance
  // AdManager.GiftOptions.Api - Conceptual namespace for the application
  const app = await NestFactory.create(AppModule);

  // 2. Enable global validation pipe
  // As per SDS 4.6, item 2: app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away properties that are not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
      transform: true, // Automatically transforms payload to DTO instances and primitive types
    }),
  );

  // 3. Global API prefixing strategy:
  // The SDS (4.6, item 3) states: "Set global API prefix if desired: app.setGlobalPrefix(GIFT_OPTIONS_API_V1_PREFIX); (or handle prefixing in controller/module)."
  // The GiftOptionsController (SDS 4.4) is decorated with @Controller(GIFT_OPTIONS_API_V1_PREFIX).
  // To avoid double prefixing (e.g., /api/v1/gift-options/api/v1/gift-options/...),
  // we rely on the controller-level prefixing as specified in the controller definition.
  // Therefore, no global prefix is set here using app.setGlobalPrefix().

  // 4. Setup Swagger/OpenAPI documentation
  // As per SDS 4.6, item 4
  const swaggerDocConfig = new DocumentBuilder()
    .setTitle('Ad Manager Gift Options API')
    .setDescription('API endpoints for managing merchant gift options.')
    .setVersion('1.0')
    .addTag('Gift Options') // Tag used in GiftOptionsController
    .addBearerAuth() // Assumes JWT Bearer token authentication as per SDS
    .build();
  const document = SwaggerModule.createDocument(app, swaggerDocConfig);

  // The Swagger UI path is explicitly defined as per SDS (4.6, item 4): `${GIFT_OPTIONS_API_V1_PREFIX}/docs`
  const swaggerUiPath = `${GIFT_OPTIONS_API_V1_PREFIX}/docs`;
  SwaggerModule.setup(swaggerUiPath, app, document);

  // 5. Start the server
  // As per SDS 4.6, item 5: await app.listen(process.env.PORT || 3000);
  const port = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(port);

  // 6. Log application start message
  // As per SDS 4.6, item 6
  const appUrl = await app.getUrl();
  Logger.log(
    `🚀 Application is running on: ${appUrl}`,
    'Bootstrap',
  );
  // GIFT_OPTIONS_API_V1_PREFIX is 'api/v1/gift-options' (doesn't start with '/').
  // Controller paths will be relative to this prefix, e.g., ${appUrl}/${GIFT_OPTIONS_API_V1_PREFIX}/merchants/...
  Logger.log(
    `API base path for Gift Options: ${appUrl}/${GIFT_OPTIONS_API_V1_PREFIX}`,
    'Bootstrap',
  );
  // swaggerUiPath is 'api/v1/gift-options/docs'.
  Logger.log(
    `📚 Swagger documentation available at: ${appUrl}/${swaggerUiPath}`,
    'Bootstrap',
  );
}

bootstrap().catch(err => {
  // Log error and exit if bootstrap fails
  Logger.error('❌ Error during application bootstrap:', err.stack || err, 'Bootstrap');
  process.exit(1);
});