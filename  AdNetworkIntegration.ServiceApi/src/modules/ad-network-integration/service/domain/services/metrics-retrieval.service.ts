import { Injectable, Inject, LoggerService, Logger } from '@nestjs/common';
import { AdNetworkAdapterFactory } from '../../adapters/ad-network-adapter.factory';
import { AdNetworkType } from '../../common/enums';
import {
  InternalMetricsRequestParamsDto,
  InternalPerformanceMetricsResultDto,
} from '../../dto/internal';

@Injectable()
export class MetricsRetrievalService {
  constructor(
    private readonly adapterFactory: AdNetworkAdapterFactory,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    this.logger.setContext(MetricsRetrievalService.name);
  }

  async fetchPerformanceMetrics(
    adNetwork: AdNetworkType,
    merchantId: string,
    params: InternalMetricsRequestParamsDto,
  ): Promise<InternalPerformanceMetricsResultDto> {
    this.logger.log(
      `Fetching performance metrics for merchant ${merchantId} on network ${AdNetworkType[adNetwork]} with params: ${JSON.stringify(params)}`,
    );

    const adapter = this.adapterFactory.getAdapter(adNetwork);
    const metricsResult = await adapter.getPerformanceMetrics(merchantId, params);

    // Potential standardization or aggregation logic here if needed
    // For example, ensuring all dates are in UTC, or all spend is in a common currency (if applicable)

    this.logger.log(
      `Successfully fetched ${metricsResult.metrics.length} metric entries for merchant ${merchantId} from ${AdNetworkType[adNetwork]}`,
    );
    return metricsResult;
  }
}