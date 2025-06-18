import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Length,
  IsDateString,
  IsOptional,
  IsIP,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ConversionItemDto } from './conversion-item.dto';

export class TrackConversionDto {
  @ApiProperty({
    description: 'The affiliate tracking code or coupon code used for attribution.',
    example: 'AFF_JOHN_DOE_REF123 or SUMMER25OFF',
  })
  @IsString()
  @IsNotEmpty()
  trackingCodeOrCoupon: string;

  @ApiProperty({
    description: "The unique identifier for the customer's order.",
    example: 'ORDER_987654321',
  })
  @IsString()
  @IsNotEmpty()
  orderId: string; // Must be unique

  @ApiProperty({
    description: 'The total amount of the order that is eligible for commission.',
    example: 199.99,
  })
  @IsNumber()
  @Min(0)
  orderAmount: number;

  @ApiProperty({
    description: 'The currency of the order amount (ISO 4217 code).',
    example: 'SAR',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  currency: string;

  @ApiPropertyOptional({
    description: 'Timestamp of when the conversion occurred. Defaults to current time if not provided.',
    example: '2023-07-20T14:35:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  conversionTimestamp?: Date;

  @ApiPropertyOptional({
    description: "Customer's IP address (for fraud detection or analytics).",
    example: '192.168.1.100',
  })
  @IsIP()
  @IsOptional()
  customerIp?: string;

  @ApiPropertyOptional({
    description: "Customer's user agent string (for fraud detection or analytics).",
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  })
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiPropertyOptional({
    description: 'Optional list of items included in the conversion, for item-level commission rules.',
    type: () => [ConversionItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConversionItemDto)
  @IsOptional()
  items?: ConversionItemDto[];
}