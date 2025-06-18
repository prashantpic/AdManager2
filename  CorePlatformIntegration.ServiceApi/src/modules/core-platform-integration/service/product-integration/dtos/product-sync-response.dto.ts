import { IsDefined, IsNumber, IsString } from 'class-validator';

export class ProductSyncResponseDto {
  @IsString()
  @IsDefined()
  readonly status: string; // e.g., 'SUCCESS', 'PARTIAL_SUCCESS', 'FAILED'

  @IsNumber()
  @IsDefined()
  readonly productsSynced: number;

  @IsNumber()
  @IsDefined()
  readonly conflictsDetected: number;
}