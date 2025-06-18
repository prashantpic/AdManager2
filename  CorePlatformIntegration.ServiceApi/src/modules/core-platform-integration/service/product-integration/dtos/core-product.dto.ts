import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsUrl,
  IsOptional,
  IsDate,
  IsDefined,
} from 'class-validator';

export class CoreProductDto {
  @IsString()
  @IsDefined()
  readonly id: string;

  @IsString()
  @IsDefined()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @Type(() => Number)
  @IsDefined()
  readonly price: number;

  @IsUrl()
  @IsOptional()
  readonly imageUrl?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  readonly stockLevel?: number;

  @IsDate()
  @Type(() => Date)
  @IsDefined()
  readonly lastUpdatedAt: Date;
}