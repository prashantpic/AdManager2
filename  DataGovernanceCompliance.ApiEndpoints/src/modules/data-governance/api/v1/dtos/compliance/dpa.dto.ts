import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsUrl, IsBoolean, IsNotEmpty } from 'class-validator';

export class DpaDto {
  @ApiProperty({
    description: 'Version of the Data Processing Agreement.',
    example: '2.1',
  })
  @IsString()
  @IsNotEmpty()
  readonly version: string;

  @ApiPropertyOptional({
    description: 'Timestamp when the DPA was acknowledged by the merchant.',
    type: Date,
    example: '2023-05-20T15:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  readonly acknowledgedAt?: Date;

  @ApiProperty({
    description: 'URL to the DPA document.',
    example: 'https://example.com/legal/dpa-v2.1.pdf',
  })
  @IsUrl()
  readonly dpaUrl: string;

  @ApiProperty({
    description: 'Indicates whether the DPA has been acknowledged by the merchant.',
    example: true,
  })
  @IsBoolean()
  readonly isAcknowledged: boolean;
}