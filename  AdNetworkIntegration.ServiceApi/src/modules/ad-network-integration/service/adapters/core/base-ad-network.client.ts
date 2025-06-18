import { Inject, Injectable, LoggerService, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import axiosRetry from 'axios-retry';
import CircuitBreaker from 'opossum';
import { ResilienceFactory } from '../../common/utils/resilience.factory';
import { AdNetworkConfig } from '../../../config/ad-network.config.interface';

// Placeholder for a more specific client config if needed per adapter
export interface AdNetworkClientConfig {
  baseUrl: string;
  timeout?: number;
  retryAttempts?: number;
  // Add other common config properties like headers, auth mechanisms etc.
}

export class AdNetworkApiException extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly errorCode?: string,
    public readonly details?: any,
    public readonly originalError?: any,
  ) {
    super(message);
    this.name = 'AdNetworkApiException';
    Object.setPrototypeOf(this, AdNetworkApiException.prototype);
  }
}

@Injectable()
export class BaseAdNetworkClient {
  protected readonly httpClient: AxiosInstance;
  private readonly adNetworkCommonConfig: AdNetworkConfig;

  constructor(
    @Inject(LoggerService) protected readonly logger: LoggerService,
    protected readonly resilienceFactory: ResilienceFactory,
    protected readonly configService: ConfigService,
    @Optional() clientSpecificConfig?: AdNetworkClientConfig, // Can be injected by specific adapters
  ) {
    this.adNetworkCommonConfig = this.configService.get<AdNetworkConfig>('adNetworks');
    const defaultConfig = {
      timeout: clientSpecificConfig?.timeout || this.adNetworkCommonConfig.defaultRequestTimeoutMs || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      baseURL: clientSpecificConfig?.baseUrl,
    };

    this.httpClient = axios.create(defaultConfig);

    axiosRetry(this.httpClient, {
      retries: clientSpecificConfig?.retryAttempts || this.adNetworkCommonConfig.defaultRetryAttempts || 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        // Retry on network errors or 5xx server errors
        return (
          axiosRetry.isNetworkError(error) ||
          (error.response && error.response.status >= 500 && error.response.status <= 599)
        );
      },
      onRetry: (retryCount, error, requestConfig) => {
        this.logger.warn(`Retrying request to ${requestConfig.url}, attempt number ${retryCount}`, BaseAdNetworkClient.name);
      }
    });
  }

  protected async requestWithResilience<T = any>(
    method: Method,
    url: string,
    commandKey: string, // e.g., "googleAds.createCampaign"
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const circuitBreaker = this.resilienceFactory.createCircuitBreaker(commandKey);

    const requestAction = async () => {
      this.logger.log(`Executing request: ${method} ${url} with commandKey: ${commandKey}`, BaseAdNetworkClient.name);
      try {
        const response = await this.httpClient.request<T>({
          method,
          url,
          data,
          ...config,
        });
        this.logger.log(`Request successful: ${method} ${url}`, BaseAdNetworkClient.name);
        return response;
      } catch (error) {
        this.logger.error(`Request failed for ${method} ${url}: ${error.message}`, error.stack, BaseAdNetworkClient.name);
        this.handleError(error, `${method} ${url}`);
      }
    };

    return circuitBreaker.fire(requestAction);
  }

  protected handleError(error: any, context: string): never {
    this.logger.error(`Error in ${context}:`, error.stack, BaseAdNetworkClient.name);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorCode = error.response?.data?.errorCode || error.code; // Prefer ad network error code
      const message = error.response?.data?.message || error.message;
      const details = error.response?.data;

      throw new AdNetworkApiException(
        `Ad Network API Error for ${context}: ${message}`,
        status,
        errorCode,
        details,
        error,
      );
    } else if (error instanceof CircuitBreaker.CircuitBreakerOpenError) {
         throw new AdNetworkApiException(
            `Circuit breaker is open for ${context}. Request not sent.`,
            503, // Service Unavailable
            'CIRCUIT_OPEN',
            error.message,
            error
        );
    } else if (error instanceof CircuitBreaker.CircuitBreakerTimeoutError) {
        throw new AdNetworkApiException(
            `Request timed out for ${context} due to circuit breaker.`,
            504, // Gateway Timeout
            'CIRCUIT_TIMEOUT',
            error.message,
            error
        );
    }


    throw new AdNetworkApiException(
      `An unexpected error occurred in ${context}: ${error.message}`,
      500,
      'INTERNAL_CLIENT_ERROR',
      error,
      error,
    );
  }
}