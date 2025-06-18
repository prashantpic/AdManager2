import { IsDefined, IsOptional, IsString } from 'class-validator';

export class ApiStatusResponseDto {
  @IsString() // e.g., 'OPERATIONAL', 'DEGRADED', 'DOWN'
  @IsDefined()
  readonly status: string;

  @IsString()
  @IsOptional()
  readonly message?: string;

  @IsString()
  @IsDefined()
  readonly checkedApi: string; // Identifier for the API that was checked
}