// src/modules/product-catalogs/api/v1/dtos/sync/conflict-resolution-strategy.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

const supportedStrategies = ['PrioritizePlatformName', 'PrioritizeAdManagerOverrides', 'NotifyMerchant', 'AttemptMerge'];

/**
 * DTO for setting or viewing the conflict resolution strategy for a product catalog.
 * Defines the payload for specifying how data discrepancies are handled during synchronization.
 */
export class ConflictResolutionStrategyDto {
  /**
   * The chosen strategy for resolving data conflicts between the core [PlatformName] data and Ad Manager overrides.
   * - 'PrioritizePlatformName': Core platform data takes precedence.
   * - 'PrioritizeAdManagerOverrides': Ad Manager specific overrides take precedence.
   * - 'NotifyMerchant': Conflicts are flagged for manual review and resolution by the merchant.
   * - 'AttemptMerge': The system attempts an intelligent merge (service-defined logic).
   * @example "PrioritizeAdManagerOverrides"
   */
  @ApiProperty({
    description: 'The chosen strategy for resolving data conflicts.',
    enum: supportedStrategies,
    example: 'PrioritizeAdManagerOverrides',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(supportedStrategies)
  strategy: 'PrioritizePlatformName' | 'PrioritizeAdManagerOverrides' | 'NotifyMerchant' | 'AttemptMerge';
}