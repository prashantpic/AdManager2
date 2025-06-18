import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';

/**
 * Data Transfer Object providing status information for analytics data ingestion processes.
 * @summary Defines the structure for returning status information about data ingestion pipelines.
 */
export class DataIngestionStatusDto {
  @ApiProperty({
    example: 'Google Ads Performance Data',
    description: 'Name of the data source being ingested.',
  })
  dataSource: string;

  @ApiPropertyOptional({
    example: '2023-03-15T10:30:00Z',
    description: 'Timestamp of the last successful data synchronization in ISO 8601 format.',
  })
  @IsISO8601()
  @IsOptional()
  lastSuccessfulSync?: string;

  @ApiProperty({
    example: 'Healthy',
    description: 'Current status of the data ingestion pipeline.',
    enum: ['Healthy', 'Syncing', 'Delayed', 'Error', 'PendingInitialSync'],
  })
  status: 'Healthy' | 'Syncing' | 'Delayed' | 'Error' | 'PendingInitialSync';

  @ApiPropertyOptional({
    example: 150234,
    description: 'Number of records processed during the last successful sync.',
    type: 'integer',
  })
  processedRecordsLastSync?: number;

  @ApiPropertyOptional({
    example: 300000,
    description:
      'Average end-to-end latency in milliseconds for data to become available in reports from last sync completion.',
    type: 'integer',
  })
  averageLatencyMsLastSync?: number;

  @ApiPropertyOptional({
    example: '2023-03-16T02:00:00Z',
    description: 'Timestamp of the next scheduled synchronization in ISO 8601 format.',
  })
  @IsISO8601()
  @IsOptional()
  nextScheduledSync?: string;

  @ApiPropertyOptional({
    description: 'Additional details or error messages related to the ingestion status.',
    example: 'API rate limit hit for source X, retrying in 1 hour.',
  })
  details?: string;
}