import { LogLevel } from './enums/log-level.enum';

export interface LoggerMetadata {
  [key: string]: any;
  correlationId?: string;
  userId?: string;
  // Add other common contextual fields
}

export interface ILogger {
  debug(message: string, meta?: LoggerMetadata): void;
  info(message: string, meta?: LoggerMetadata): void;
  warn(message: string, meta?: LoggerMetadata): void;
  error(message: string, error?: Error | unknown, meta?: LoggerMetadata): void;
  setLogLevel(level: LogLevel): void;
  getLogLevel(): LogLevel;
}