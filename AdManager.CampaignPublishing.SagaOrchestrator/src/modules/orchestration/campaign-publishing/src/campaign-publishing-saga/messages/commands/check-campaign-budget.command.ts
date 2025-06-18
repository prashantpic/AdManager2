import { IsUUID, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CheckCampaignBudgetCommand {
  @IsUUID()
  readonly correlationId: string;

  @IsUUID()
  readonly campaignId: string;

  @IsUUID()
  readonly merchantId: string;

  @IsNumber()
  readonly budgetAmount: number;

  @IsString()
  @IsNotEmpty() // Could use @IsCurrency() if a more specific validation is needed and available
  readonly currency: string;
}