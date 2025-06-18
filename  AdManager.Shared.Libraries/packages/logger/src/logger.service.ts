import pino, { Logger as PinoLogger } from 'pino';
import { ILogger, LoggerMetadata } from './logger.interface';
import { LoggerConfig, DEFAULT_LOGGER_CONFIG } from './logger.config';
import { LogLevel } from './enums/log-level.enum';

export class LoggerService implements ILogger {
  private pinoLogger: PinoLogger;
  private currentLevel: LogLevel;
  private readonly serviceName: string;

  constructor(config: Partial<LoggerConfig> & { serviceName: string }) {
    const fullConfig: LoggerConfig = {
      ...DEFAULT_LOGGER_CONFIG,
      ...config,
    };
    this.serviceName = fullConfig.serviceName;
    this.currentLevel = fullConfig.level;

    const pinoOptions: pino.LoggerOptions = {
      level: this.currentLevel,
      name: this.serviceName,
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level: (label) => {
          return { level: label };
        },
        bindings: (bindings) => {
          return {
            pid: bindings.pid,
            hostname: bindings.hostname,
            service: this.serviceName,
          };
        },
      },
    };

    if (fullConfig.isProduction) {
      // In production, log as JSON to stdout, which can be collected by CloudWatch, etc.
      this.pinoLogger = pino(pinoOptions);
    } else {
      if (fullConfig.prettyPrint) {
        pinoOptions.transport = {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
            ignore: 'pid,hostname,serviceName', // serviceName is part of name
            messageKey: 'msg', // Default pino-pretty messageKey
          },
        };
      }
      this.pinoLogger = pino(pinoOptions);
    }
  }

  private formatMeta(meta?: LoggerMetadata): Record<string, any> {
    // Merge with serviceName for context, though pino's name binding handles this too
    return meta ? { ...meta } : {};
  }

  debug(message: string, meta?: LoggerMetadata): void {
    this.pinoLogger.debug(this.formatMeta(meta), message);
  }

  info(message: string, meta?: LoggerMetadata): void {
    this.pinoLogger.info(this.formatMeta(meta), message);
  }

  warn(message: string, meta?: LoggerMetadata): void {
    this.pinoLogger.warn(this.formatMeta(meta), message);
  }

  error(message: string, error?: Error | unknown, meta?: LoggerMetadata): void {
    const logObject: Record<string, any> = this.formatMeta(meta);
    if (error instanceof Error) {
      logObject.err = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...error, // Include other potential custom error properties
      };
    } else if (error) {
        logObject.err = error; // Log as-is if not an Error instance
    }
    this.pinoLogger.error(logObject, message);
  }
  
  setLogLevel(level: LogLevel): void {
    this.currentLevel = level;
    this.pinoLogger.level = level;
  }

  getLogLevel(): LogLevel {
    return this.currentLevel as LogLevel; // pino.level is string, cast to our enum
  }
}