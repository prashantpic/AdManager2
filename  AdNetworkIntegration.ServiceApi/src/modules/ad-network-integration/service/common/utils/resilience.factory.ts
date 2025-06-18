```typescript
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CircuitBreaker from 'opossum';
import { AdNetworkConfig } from '../../../service/config/ad-network.config.interface';

export type OpossumOptions = CircuitBreaker.Options;

@Injectable()
export class ResilienceFactory {
  private readonly logger = new Logger(ResilienceFactory.name);
  private circuitBreakers = new Map<string, CircuitBreaker>();
  private readonly adNetworkConfig: AdNetworkConfig;

  constructor(private readonly configService: ConfigService) {
    this.adNetworkConfig = this.configService.get<AdNetworkConfig>('adNetworkConfig') as AdNetworkConfig;
  }

  /**
   * Creates or retrieves a cached circuit breaker instance for a given command key.
   * @param commandKey A unique identifier for the operation this circuit breaker protects.
   *                   (e.g., 'googleAds.createCampaign', 'tiktokAds.getMetrics')
   * @param options Custom options to override default circuit breaker settings.
   * @returns An Opossum CircuitBreaker instance.
   */
  public createCircuitBreaker(
    commandKey: string,
    options?: OpossumOptions,
  ): CircuitBreaker {
    if (this.circuitBreakers.has(commandKey)) {
      return this.circuitBreakers.get(commandKey) as CircuitBreaker;
    }

    const defaultOptions: OpossumOptions = {
      timeout: this.adNetworkConfig.defaultRequestTimeoutMs || 15000, //milliseconds
      errorThresholdPercentage: 50, // Percent of errors needed to open circuit
      resetTimeout: 30000, // Milliseconds to wait before trying again
      name: commandKey, // Name for logging and events
      // rollingCountTimeout: 10000, // The duration of the statistical rolling window in milliseconds.
      // rollingCountBuckets: 10, // The number of buckets the rolling statistical window is divided into.
      // capacity: 100 // The maximum number of requests allowed in a halfOpen state.
    };

    const circuitBreakerOptions: OpossumOptions = {
      ...defaultOptions,
      ...options, // User-provided options override defaults
    };

    const breaker = new CircuitBreaker(async (action: (...args: any[]) => Promise<any>, ...args: any[]) => {
        // The action is the function to be executed, e.g., an Axios request.
        // The BaseAdNetworkClient will pass the actual API call function here.
        return action(...args);
    }, circuitBreakerOptions);

    // Event listeners for monitoring and logging
    breaker.on('open', () =>
      this.logger.warn(`CircuitBreaker '${commandKey}' opened. Service may be unavailable.`),
    );
    breaker.on('close', () =>
      this.logger.log(`CircuitBreaker '${commandKey}' closed. Service is operational.`),
    );
    breaker.on('halfOpen', () =>
      this.logger.log(`CircuitBreaker '${commandKey}' is half-open. Testing service health.`),
    );
    breaker.on('success', (result, latency) =>
      this.logger.debug(`CircuitBreaker '${commandKey}' request succeeded. Latency: ${latency}ms`),
    );
    breaker.on('failure', (error, latency) =>
      this.logger.error(`CircuitBreaker '${commandKey}' request failed. Error: ${error?.message || error}. Latency: ${latency}ms`),
    );
    // 'reject' is emitted if the circuit is open and a call is rejected immediately
    breaker.on('reject', () => 
      this.logger.warn(`CircuitBreaker '${commandKey}' rejected call as circuit is open.`)
    );
    // 'timeout' is emitted if the action times out
    breaker.on('timeout', () => 
        this.logger.error(`CircuitBreaker '${commandKey}' action timed out.`)
    );
    
    this.circuitBreakers.set(commandKey, breaker);
    this.logger.log(`CircuitBreaker '${commandKey}' created with options: ${JSON.stringify(circuitBreakerOptions)}`);
    return breaker;
  }
}
```