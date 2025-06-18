import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// Defined CoreOrderItemDto here as per earlier thought process
// if core-order-item.dto.ts is not in the generation list for this iteration.
export class CoreOrderItemDto {
  @IsString()
  @IsDefined()
  readonly productId: string;

  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  readonly quantity: number;

  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  readonly unitPrice: number;

  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  readonly totalPrice: number;
}

export class CoreOrderDto {
  @IsString()
  @IsDefined()
  readonly orderId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoreOrderItemDto)
  @IsDefined()
  readonly items: CoreOrderItemDto[];

  @IsNumber()
  @Type(() => Number)
  @IsDefined()
  readonly totalValue: number;

  @IsString()
  @IsDefined()
  readonly currency: string;

  @IsDate()
  @Type(() => Date)
  @IsDefined()
  readonly timestamp: Date;

  @IsString()
  @IsOptional()
  readonly attributionSource?: string;
}