import { IsUUID, IsString, IsOptional } from 'class-validator';

export class BillingCheckSuccessfulEvent {
  @IsUUID()
  readonly correlationId: string;

  @IsUUID()
  readonly campaignId: string;

  @IsOptional()
  @IsString()
  readonly message?: string;
}