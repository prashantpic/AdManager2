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
        package: 'AdManager.AdNetworkIntegration.Service.V1', // Matches package in .proto
        protoPath: join(__dirname, '../../../../src/grpc/protos/ad_network_integration.v1.proto'), // Adjusted path relative to dist/main.js
        url: process.env.GRPC_CONNECTION_URL || '0.0.0.0:50051', // Configurable URL
        loader: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
          includeDirs: [join(__dirname, '../../../../src/grpc/protos')], // Directory for common.v1.proto
        },
      },
    },
  );

  // Use a global validation pipe if class-validator is used on DTOs handled by gRPC methods
  // Note: gRPC typically relies on proto definitions for validation, but for complex internal DTOs passed around,
  // class-validator can be useful. If using proto-generated types directly in controllers, this might be less critical.
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips away properties not defined in DTO
    forbidNonWhitelisted: true, // Throws error if non-whitelisted properties are present
    transform: true, // Automatically transforms payload to DTO instance
  }));

  app.useLogger(app.get(Logger)); // Use NestJS built-in logger

  await app.listen();
  logger.log(`AdNetworkIntegration gRPC Service is running on ${process.env.GRPC_CONNECTION_URL || '0.0.0.0:50051'}`);
}
bootstrap();