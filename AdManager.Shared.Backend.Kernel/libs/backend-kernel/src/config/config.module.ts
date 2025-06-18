import { Module, Global } from '@nestjs/common';
import { IConfigService } from './interfaces/config.service.interface';
// Choose the appropriate implementation:
import { AwsParameterStoreConfigService } from './services/aws-parameter-store-config.service';
// import { EnvironmentConfigService } from './services/environment-config.service';
import { CONFIG_SERVICE_TOKEN } from './constants/config.constants';
import { LoggingModule } from '../logging/logging.module'; // Config service needs logger

@Global() // Config service should be globally available
@Module({
  imports: [LoggingModule], // AwsParameterStoreConfigService needs ILoggerService
  providers: [
    {
      provide: CONFIG_SERVICE_TOKEN, // Or use IConfigService directly
      useClass: AwsParameterStoreConfigService, // Or EnvironmentConfigService if that's the chosen one
    },
  ],
  exports: [CONFIG_SERVICE_TOKEN], // Or IConfigService
})
export class ConfigModule {}