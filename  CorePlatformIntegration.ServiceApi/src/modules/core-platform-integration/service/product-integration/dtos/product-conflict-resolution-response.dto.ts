import { IsDefined, IsOptional, IsString } from 'class-validator';

export class ProductConflictResolutionResponseDto {
  @IsString()
  @IsDefined()
  readonly productId: string;

  @IsString() // e.g., 'RESOLVED', 'NOTIFICATION_SENT', 'FAILED'
  @IsDefined()
  readonly resolutionStatus: string;

  @IsString()
  @IsOptional()
  readonly message?: string;
}