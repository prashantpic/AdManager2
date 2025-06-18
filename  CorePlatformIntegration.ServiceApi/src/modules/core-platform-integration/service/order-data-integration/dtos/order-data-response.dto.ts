import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsDefined } from 'class-validator';
import { CoreOrderDto } from './core-order.dto';

export class OrderDataResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoreOrderDto)
  @IsDefined()
  readonly orders: CoreOrderDto[];
}