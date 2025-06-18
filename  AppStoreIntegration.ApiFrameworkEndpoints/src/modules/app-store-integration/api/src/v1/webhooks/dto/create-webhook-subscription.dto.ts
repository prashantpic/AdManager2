import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsUrl,
  ArrayNotEmpty,
  IsOptional,
  MinLength,
  // IsEnum, // Would be used if WebhookEventType enum is directly importable
} from 'class-validator';
// import { WebhookEventType } from '../../common/enums/webhook-event-type.enum'; // Path to the actual enum

/**
 * @description Data Transfer Object for creating a new webhook subscription.
 * Defines the payload for requests to create webhook subscriptions.
 */
export class CreateWebhookSubscriptionDto {
  @ApiProperty({
    description: 'The target URL where webhook events should be sent. Must be HTTPS.',
    example: 'https://myapp.example.com/webhooks',
  })
  @IsNotEmpty()
  @IsUrl({ require_tld: true, protocols: ['https'] }) // Enforce HTTPS
  targetUrl: string;

  @ApiProperty({
    description: 'An array of event types to subscribe to. These should correspond to defined WebhookEventType enum values.',
    example: ['CAMPAIGN_CREATED', 'PRODUCT_UPDATED'],
    type: [String], // Using string[] as WebhookEventType enum is not generated in this batch.
                    // In a full project, this would be: @IsEnum(WebhookEventType, { each: true })
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) // Placeholder validation for string array
  eventTypes: string[]; // Ideally: WebhookEventType[];

  @ApiPropertyOptional({
    description: 'An optional secret used to sign webhook payloads. If provided, it will be used to generate a signature for verification by the subscriber. Minimum 16 characters.',
    example: 'a_very_secure_and_long_secret_string',
    minLength: 16,
  })
  @IsOptional()
  @IsString()
  @MinLength(16)
  secret?: string;
}