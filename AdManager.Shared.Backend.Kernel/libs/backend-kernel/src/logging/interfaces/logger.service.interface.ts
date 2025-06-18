```typescript
export interface LogMeta {
  [key: string]: any;
  // Standard common fields can be defined here if needed
  // e.g., correlationId?: string;
  // e.g., tenantId?: string;
}

export interface ILoggerService {
  /**
   * Logs a standard informational message.
   * @param message - The main log message.
   * @param context - Optional context string (e.g., class name, method name).
   * @param meta - Optional additional metadata.
   */
  log(message: string, context?: string, meta?: LogMeta): void;

  /**
   * Logs an error message, optionally with a stack trace.
   * @param message - The error message or an Error object.
   * @param trace - Optional stack trace (if message is not an Error object).
   * @param context - Optional context string.
   * @param meta - Optional additional metadata.
   */
  error(message: string | Error, trace?: string, context?: string, meta?: LogMeta): void;

  /**
   * Logs a warning message.
   * @param message - The warning message.
   * @param context - Optional context string.
   * @param meta - Optional additional metadata.
   */
  warn(message: string, context?: string, meta?: LogMeta): void;

  /**
   * Logs a debug message, typically for development.
   * @param message - The debug message.
   * @param context - Optional context string.
   * @param meta - Optional additional metadata.
   */
  debug(message: string, context?: string, meta?: LogMeta): void;

  /**
   * Logs a verbose message, more detailed than debug.
   * @param message - The verbose message.
   * @param context - Optional context string.
   * @param meta - Optional additional metadata.
   */
  verbose(message: string, context?: string, meta?: LogMeta): void;
}
```