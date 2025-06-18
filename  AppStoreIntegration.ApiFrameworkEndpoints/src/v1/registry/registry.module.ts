import { Module } from '@nestjs/common';
import { AppRegistryController } from './controllers/app-registry.controller';
import { AppRegistryService } from './services/app-registry.service';
import { AuthModule } from '../auth/auth.module'; // For guards if developer auth uses JWT
import { IThirdPartyConnectivityService } from '../common/interfaces/third-party-connectivity.interface';
import { ThirdPartyConnectivityServiceProvider } from '../common/providers/third-party-connectivity.provider';


/**
 * NestJS module for third-party application registration and management.
 * It groups all components related to the app registry.
 */
@Module({
  imports: [
    AuthModule, // If @UseGuards(JwtAuthGuard) from AuthModule is used in AppRegistryController
  ],
  controllers: [AppRegistryController],
  providers: [
    AppRegistryService,
    {
      provide: IThirdPartyConnectivityService,
      useClass: ThirdPartyConnectivityServiceProvider, // Provide a concrete implementation or mock
    },
  ],
  exports: [AppRegistryService],
})
export class RegistryModule {}