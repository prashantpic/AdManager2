import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'admanager.coreplatformintegration.service.v1',
        protoPath: join(
          __dirname,
          'modules/core-platform-integration/service/protos/core_platform_integration.proto',
        ),
        url: process.env.GRPC_SERVER_URL || '0.0.0.0:50051',
        loader: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
          includeDirs: [join(__dirname, 'modules/core-platform-integration/service/protos')], // For imports in master proto
        },
      },
    },
  );

  // Apply global validation pipe for DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips properties that do not have any decorators
    forbidNonWhitelisted: true, // Throws an error if non-whitelisted values are provided
    transform: true, // Automatically transform payloads to DTO instances
  }));

  await app.listen();
  logger.log(
    `CorePlatformIntegration gRPC Service is running on ${
      process.env.GRPC_SERVER_URL || '0.0.0.0:50051'
    }`,
  );
}
bootstrap();