import { LogLevel } from './enums/log-level.enum';

export interface LoggerConfig {
  level: LogLevel;
  serviceName: string;
  isProduction: boolean;
  prettyPrint?: boolean; // For development
  // Add other pino/winston specific config options if needed
}

export const DEFAULT_LOGGER_CONFIG: Omit<LoggerConfig, 'serviceName'> = {
  level: LogLevel.INFO,
  isProduction: process.env.NODE_ENV === 'production',
  prettyPrint: process.env.NODE_ENV !== 'production',
};