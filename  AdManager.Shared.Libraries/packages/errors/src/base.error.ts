export abstract class CustomBaseError extends Error {
  public readonly code: string | number;
  public readonly statusCode: number;
  public readonly context?: Record<string, any>;
  public readonly isOperational: boolean; // Indicates if this is a known, operational error

  constructor(
    message: string,
    statusCode: number,
    code: string | number,
    isOperational: boolean = true,
    context?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name; // Set the error name to the class name
    this.statusCode = statusCode;
    this.code = code;
    this.context = context;
    this.isOperational = isOperational;

    // This line is important for proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}