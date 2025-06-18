import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express'; // Import Response from express

export interface StandardResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success: boolean;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>(); // Use ExpressResponse

    return next.handle().pipe(
      map(data => ({
        statusCode: response.statusCode,
        message: 'Success', // Or derive from context/data if needed
        data,
        success: true,
      })),
    );
  }
}