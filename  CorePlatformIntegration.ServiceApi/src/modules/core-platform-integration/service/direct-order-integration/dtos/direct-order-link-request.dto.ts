import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class DirectOrderLinkRequestDto {
  @IsString()
  @IsDefined()
  readonly productId: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  readonly quantity?: number;

  @IsString()
  @IsDefined()
  readonly merchantId: string;
}