import { Module, Global } from '@nestjs/common';
import { ILoggerService } from './interfaces/logger.service.interface';
import { WinstonLoggerService } from './services/winston-logger.service';
import { ConfigModule as KernelConfigModule } from '../../config/config.module'; // Ensure config is available
import { LOGGER_SERVICE_TOKEN } from './constants/logging.constants';

@Global() // Making logger globally available without importing LoggingModule everywhere
@Module({
  imports: [KernelConfigModule], // WinstonLoggerService depends on IConfigService
  providers: [
    {
      provide: LOGGER_SERVICE_TOKEN, // Or use ILoggerService directly as token if preferred
      useClass: WinstonLoggerService,
    },
    // For NestJS built-in Logger compatibility, you might also provide WinstonLoggerService itself
    // or a factory that creates a Logger instance for NestFactory.create
    WinstonLoggerService, // So it can be injected by its class name for setContext
  ],
  exports: [
    LOGGER_SERVICE_TOKEN,
    WinstonLoggerService, // Export the concrete class if setContext is used directly
  ],
})
export class LoggingModule {}