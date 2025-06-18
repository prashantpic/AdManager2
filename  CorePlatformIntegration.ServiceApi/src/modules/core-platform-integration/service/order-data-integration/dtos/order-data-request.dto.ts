import { IsArray, IsOptional, IsString, Matches } from 'class-validator';

export class OrderDataRequestDto {
  @IsString()
  readonly merchantId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly campaignIds?: string[];

  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { // YYYY-MM-DD
    message: 'dateFrom must be in YYYY-MM-DD format',
  })
  readonly dateFrom?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { // YYYY-MM-DD
    message: 'dateTo must be in YYYY-MM-DD format',
  })
  readonly dateTo?: string;
}