import { Injectable, Scope, Inject } from '@nestjs/common';
import * as winston from 'winston';
import { ILoggerService, LogMeta } from '@logging/interfaces/logger.service.interface';
import { IConfigService } from '@config/interfaces/config.service.interface';
import { CONFIG_SERVICE_TOKEN } from '@config/constants/config.constants';

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService implements ILoggerService {
  private readonly logger: winston.Logger;
  private serviceContext?: string;

  constructor(
    @Inject(CONFIG_SERVICE_TOKEN) private readonly configService: IConfigService,
  ) {
    const logLevel = this.configService.get<string>('LOG_LEVEL') || 'info';
    const serviceName = this.configService.get<string>('SERVICE_NAME') || 'admanager-service';

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        // Note: Using winston.format.json() directly is simpler for structured logging.
        // The printf example in SDS is more for custom string formatting.
        // For pure JSON, winston.format.json() is preferred.
        // If a specific structure like the printf is required, it must be ensured it produces valid JSON.
        // Here, we'll combine json() with a customizer if needed, or just json()
        winston.format.printf(info => {
          const { timestamp, level, message, context, stack, service, ...meta } = info;
          const logObject: Record<string, any> = {
            timestamp,
            level,
            message,
            serviceName: service || serviceName, // Use serviceName from config or defaultMeta
            context: context || this.serviceContext, // Use passed context or class context
            ...meta,
          };
          if (stack) {
            logObject.stack = stack;
          }
          return JSON.stringify(logObject);
        })
      ),
      transports: [
        new winston.transports.Console(),
      ],
      defaultMeta: { service: serviceName },
    });
  }

  public setContext(context: string): void {
    this.serviceContext = context;
  }

  log(message: string, context?: string, meta?: LogMeta): void {
    this.logger.info(message, { context: context || this.serviceContext, ...meta });
  }

  error(error: string | Error, trace?: string, context?: string, meta?: LogMeta): void {
    const message = error instanceof Error ? error.message : error;
    // Winston's format.errors({ stack: true }) should handle the stack.
    // If error is an Error object, pass it directly to Winston.
    if (error instanceof Error) {
        this.logger.error(error.message, { error, context: context || this.serviceContext, stack: error.stack, ...meta });
    } else {
        this.logger.error(message, { context: context || this.serviceContext, stack: trace, ...meta });
    }
  }

  warn(message: string, context?: string, meta?: LogMeta): void {
    this.logger.warn(message, { context: context || this.serviceContext, ...meta });
  }

  debug(message: string, context?: string, meta?: LogMeta): void {
    this.logger.debug(message, { context: context || this.serviceContext, ...meta });
  }

  verbose(message: string, context?: string, meta?: LogMeta): void {
    this.logger.verbose(message, { context: context || this.serviceContext, ...meta });
  }
}