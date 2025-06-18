import { Module } from '@nestjs/common';
import { DataAccessService } from './services/data-access.service';
import { SampleResourceController } from './rest/controllers/sample-resource.controller';
import { SampleResourceResolver } from './graphql/resolvers/sample-resource.resolver';
import { AuthModule } from '../auth/auth.module'; // For JWT guards and strategy

/**
 * @module DataExchangeModule
 * @description NestJS module aggregating REST and GraphQL API functionalities for third-party data exchange.
 * It provides the necessary controllers, resolvers, and services for data access.
 * Protected endpoints within this module rely on authentication mechanisms provided by `AuthModule`.
 */
@Module({
  imports: [
    AuthModule, // Imports AuthModule to use JwtAuthGuard and related authentication components
  ],
  controllers: [
    SampleResourceController, // Registers REST controllers for data exchange
  ],
  providers: [
    DataAccessService,      // Provides the service layer for data access logic
    SampleResourceResolver, // Registers GraphQL resolvers
    // IThirdPartyConnectivityService would be provided here or in a shared infrastructure module
    // For now, DataAccessService will expect it to be injected.
  ],
  exports: [
    // DataAccessService, // Export if other modules within V1 need direct access (unlikely for this design)
  ],
})
export class DataExchangeModule {}