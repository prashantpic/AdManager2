```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

export interface IBasePlatformExceptionPayload {
  statusCode: number;
  message: string;
  errorCode: string;
  timestamp: string;
  path?: string; // Will be added by the filter
  details?: Record<string, any> | string[];
}

export class BasePlatformException extends HttpException {
  public readonly errorCode: string;
  public readonly details?: Record<string, any> | string[];

  constructor(
    message: string | Record<string, any>,
    status: HttpStatus | number,
    errorCode: string,
    details?: Record<string, any> | string[],
  ) {
    const responsePayload: Partial<IBasePlatformExceptionPayload> = {
        message: typeof message === 'string' ? message : (message as any)?.error || 'Error',
        errorCode,
        details,
    };
    
    super(typeof message === 'string' ? responsePayload : message, status);
    this.errorCode = errorCode;
    this.details = details;
  }
}
```