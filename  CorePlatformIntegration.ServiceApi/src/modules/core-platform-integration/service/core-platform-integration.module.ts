import { Module, Logger } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CorePlatformIntegrationGrpcController } from './core-platform-integration.grpc.controller';

import { ProductIntegrationService } from './product-integration/product-integration.service';
import { AuthIntegrationService } from './auth-integration/auth-integration.service';
import { CustomerDataIntegrationService } from './customer-data-integration/customer-data-integration.service';
import { OrderDataIntegrationService } from './order-data-integration/order-data-integration.service';
import { DirectOrderIntegrationService } from './direct-order-integration/direct-order-integration.service';

import { ProductClient } from './product-integration/product.client';
import { AuthClient } from './auth-integration/auth.client';
import { CustomerClient } from './customer-data-integration/customer.client';
import { OrderClient } from './order-data-integration/order.client';

import { CorePlatformApiConfigInterface } from './common/config/core-platform-api.config';


@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const apiConfig = configService.get<CorePlatformApiConfigInterface>('corePlatformApi');
        return {
          timeout: apiConfig?.timeout || 5000,
          maxRedirects: 5,
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule, // Already imported globally in AppModule, but good for explicitness if ever changed
  ],
  controllers: [CorePlatformIntegrationGrpcController],
  providers: [
    Logger,
    ProductIntegrationService,
    AuthIntegrationService,
    CustomerDataIntegrationService,
    OrderDataIntegrationService,
    DirectOrderIntegrationService,
    ProductClient,
    AuthClient,
    CustomerClient,
    OrderClient,
  ],
})
export class CorePlatformIntegrationModule {}