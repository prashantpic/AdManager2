import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsBoolean, IsDate, IsOptional, IsIP } from 'class-validator';

export class ConsentRecordDto {
  @ApiProperty({
    description: 'Unique identifier for the consent record.',
    format: 'uuid',
    example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
  })
  @IsUUID()
  readonly id: string;

  @ApiProperty({
    description: 'Identifier of the user.',
    example: 'user-uuid-1234',
  })
  @IsString()
  readonly userId: string;

  @ApiProperty({
    description: 'Type of consent.',
    example: 'marketing_emails',
  })
  @IsString()
  readonly consentType: string;

  @ApiProperty({
    description: 'Consent status (true if given, false if withdrawn).',
    example: true,
  })
  @IsBoolean()
  readonly isGiven: boolean;

  @ApiProperty({
    description: 'Timestamp of when the consent action was recorded.',
    type: Date,
    example: '2023-10-26T10:00:00.000Z',
  })
  @IsDate()
  readonly timestamp: Date;

  @ApiProperty({
    description: 'Source of the consent action.',
    example: 'preference_center',
  })
  @IsString()
  readonly source: string;

  @ApiPropertyOptional({
    description: 'Version of the policy/DPA consented to.',
    example: 'v1.2',
  })
  @IsOptional()
  @IsString()
  readonly version?: string;

  @ApiPropertyOptional({
    description: 'IP address recorded at the time of consent.',
    example: '192.168.1.100',
  })
  @IsOptional()
  @IsIP()
  readonly ipAddress?: string;

  @ApiPropertyOptional({
    description: 'User agent recorded at the time of consent.',
    example: 'Mozilla/5.0 (...)',
  })
  @IsOptional()
  @IsString()
  readonly userAgent?: string;
}