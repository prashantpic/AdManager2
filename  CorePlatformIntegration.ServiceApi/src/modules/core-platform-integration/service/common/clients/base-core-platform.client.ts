import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig }_ from 'axios';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, map, retryWhen, mergeMap, take, timeout as rxjsTimeout } from 'rxjs/operators';
import { CorePlatformApiConfigInterface } from '../config/core-platform-api.config';

// Define custom exceptions that services can catch
// These should ideally be in a separate file like src/common/exceptions/core-platform-integration.exceptions.ts
export class CorePlatformApiException extends Error {
  public readonly status: number;
  public readonly responseData?: any;
  constructor(message: string, status: number, responseData?: any) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.responseData = responseData;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class CorePlatformApiUnavailableException extends CorePlatformApiException {
  constructor(message = '[PlatformName] API is unavailable or timed out.', responseData?: any) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE, responseData);
  }
}

export class CorePlatformApiBadRequestException extends CorePlatformApiException {
  constructor(message = '[PlatformName] API Bad Request.', responseData?: any) {
    super(message, HttpStatus.BAD_REQUEST, responseData);
  }
}

export class CorePlatformApiUnauthorizedException extends CorePlatformApiException {
  constructor(message = '[PlatformName] API Unauthorized.', responseData?: any) {
    super(message, HttpStatus.UNAUTHORIZED, responseData);
  }
}
export class CorePlatformApiForbiddenException extends CorePlatformApiException {
  constructor(message = '[PlatformName] API Forbidden.', responseData?: any) {
    super(message, HttpStatus.FORBIDDEN, responseData);
  }
}

export class CorePlatformNotFoundException extends CorePlatformApiException {
  constructor(message = '[PlatformName] API Resource Not Found.', responseData?: any) {
    super(message, HttpStatus.NOT_FOUND, responseData);
  }
}

export class CorePlatformConflictException extends CorePlatformApiException {
    constructor(message = '[PlatformName] API Conflict.', responseData?: any) {
        super(message, HttpStatus.CONFLICT, responseData);
    }
}


export abstract class BaseCorePlatformClient {
  protected readonly baseUrl: string;
  protected readonly apiTimeout: number;
  protected readonly retryAttempts: number;

  constructor(
    protected readonly httpClient: HttpService,
    protected readonly configService: ConfigService<CorePlatformApiConfigInterface>,
    protected readonly logger: Logger,
  ) {
    this.baseUrl = this.configService.get('baseUrl');
    this.apiTimeout = this.configService.get('timeout');
    this.retryAttempts = this.configService.get('retryAttempts');
    this.logger.setContext(this.constructor.name);
  }

  protected async get<T>(endpoint: string, params?: any, headers?: any): Promise<T> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    const config: AxiosRequestConfig = {
      params,
      headers: { ...this.getCommonHeaders(), ...headers },
    };

    this.logger.log(`Sending GET request to ${fullUrl} with params: ${JSON.stringify(params)}`);

    return this.httpClient
      .get<T>(fullUrl, config)
      .pipe(
        rxjsTimeout(this.apiTimeout),
        map((response) => {
          this.logger.log(`Received response from GET ${fullUrl}: Status ${response.status}`);
          return response.data;
        }),
        retryWhen(this.genericRetryStrategy()),
        catchError((error: AxiosError) => {
          return throwError(() => this.handleError(error, 'GET', fullUrl, params));
        }),
      )
      .toPromise();
  }

  protected async post<T>(endpoint: string, data: any, headers?: any): Promise<T> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    const config: AxiosRequestConfig = {
      headers: { ...this.getCommonHeaders(), ...headers },
    };

    this.logger.log(`Sending POST request to ${fullUrl} with data: ${JSON.stringify(data)}`);

    return this.httpClient
      .post<T>(fullUrl, data, config)
      .pipe(
        rxjsTimeout(this.apiTimeout),
        map((response) => {
          this.logger.log(`Received response from POST ${fullUrl}: Status ${response.status}`);
          return response.data;
        }),
        retryWhen(this.genericRetryStrategy()),
        catchError((error: AxiosError) => {
          return throwError(() => this.handleError(error, 'POST', fullUrl, data));
        }),
      )
      .toPromise();
  }
  
  protected getCommonHeaders(): Record<string, string> {
    const commonHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    // Example for API Key, if CorePlatformApiConfigInterface includes it
    // const apiKey = this.configService.get('apiKey');
    // if (apiKey) {
    //   commonHeaders['Authorization'] = `Bearer ${apiKey}`;
    // }
    return commonHeaders;
  }

  private genericRetryStrategy =
    ({
      maxRetryAttempts = this.retryAttempts,
      scalingDuration = 1000, // ms
      excludedStatusCodes = [400, 401, 403, 404, 409], // Don't retry client errors
    }: {
      maxRetryAttempts?: number;
      scalingDuration?: number;
      excludedStatusCodes?: number[];
    } = {}) =>
    (attempts: Observable<AxiosError>) => {
      return attempts.pipe(
        mergeMap((error, i) => {
          const retryAttempt = i + 1;
          if (
            retryAttempt > maxRetryAttempts ||
            (error.response && excludedStatusCodes.includes(error.response.status))
          ) {
            return throwError(() => error); // Propagate error if max retries or excluded status
          }
          this.logger.warn(
            `Retry attempt ${retryAttempt} for ${error.config?.url} due to ${error.code || error.response?.statusText}. Delaying ${retryAttempt * scalingDuration}ms`,
          );
          return timer(retryAttempt * scalingDuration); // Exponential backoff
        }),
        take(maxRetryAttempts + 1), // Ensure observable completes
      );
    };

  private handleError(error: AxiosError, method: string, url: string, requestData?: any): CorePlatformApiException {
    const errorMessage = `Failed ${method} request to ${url}.`;
    this.logger.error(`${errorMessage} Request Data: ${JSON.stringify(requestData)}. Error: ${error.message}`, error.stack);

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return new CorePlatformApiUnavailableException(`[PlatformName] API request timed out after ${this.apiTimeout}ms. ${error.message}`, error.response?.data);
    }

    if (error.response) {
      const { status, data } = error.response;
      this.logger.error(`[PlatformName] API Error: Status ${status}, Data: ${JSON.stringify(data)}`);
      switch (status) {
        case HttpStatus.BAD_REQUEST: // 400
          return new CorePlatformApiBadRequestException(`[PlatformName] API Bad Request: ${data?.message || 'Invalid request parameters.'}`, data);
        case HttpStatus.UNAUTHORIZED: // 401
          return new CorePlatformApiUnauthorizedException(`[PlatformName] API Unauthorized: ${data?.message || 'Authentication failed or invalid API key.'}`, data);
        case HttpStatus.FORBIDDEN: // 403
            return new CorePlatformApiForbiddenException(`[PlatformName] API Forbidden: ${data?.message || 'Access to this resource is forbidden.'}`, data);
        case HttpStatus.NOT_FOUND: // 404
          return new CorePlatformNotFoundException(`[PlatformName] API Resource Not Found: ${url}`, data);
        case HttpStatus.CONFLICT: // 409
          return new CorePlatformConflictException(`[PlatformName] API Conflict: ${data?.message || 'Resource conflict.'}`, data);
        case HttpStatus.INTERNAL_SERVER_ERROR: // 500
        case HttpStatus.BAD_GATEWAY: // 502
        case HttpStatus.SERVICE_UNAVAILABLE: // 503
        case HttpStatus.GATEWAY_TIMEOUT: // 504
          return new CorePlatformApiUnavailableException(`[PlatformName] API Service Unavailable (Status: ${status}): ${data?.message || 'The service is temporarily unavailable.'}`, data);
        default:
          return new CorePlatformApiException(`Unexpected [PlatformName] API Error (Status: ${status}): ${data?.message || 'An unexpected error occurred.'}`, status, data);
      }
    } else if (error.request) {
      this.logger.error('[PlatformName] API Error: No response received from server.');
      return new CorePlatformApiUnavailableException('[PlatformName] API did not respond.');
    } else {
      this.logger.error(`[PlatformName] API Error: Request setup failed: ${error.message}`);
      return new CorePlatformApiException(`Failed to make request to [PlatformName] API: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}