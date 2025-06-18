import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsDate, IsOptional, IsEmail } from 'class-validator';

export class DsrRequestDto {
  @ApiProperty({
    description: 'Unique identifier for the DSR request.',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  readonly id: string;

  @ApiProperty({
    description: 'Type of DSR request.',
    example: 'access',
  })
  @IsString()
  readonly requestType: string;

  @ApiProperty({
    description: 'Current status of the DSR request.',
    example: 'PendingVerification',
  })
  @IsString()
  readonly status: string; // e.g., 'PendingVerification', 'PendingFulfillment', 'InProgress', 'Completed', 'Denied', 'RequiresAction'

  @ApiProperty({
    description: 'Timestamp when the DSR request was submitted.',
    type: Date,
    example: '2023-10-26T11:00:00.000Z',
  })
  @IsDate()
  readonly submittedAt: Date;

  @ApiProperty({
    description: 'Timestamp of the last update to the DSR request.',
    type: Date,
    example: '2023-10-26T11:05:00.000Z',
  })
  @IsDate()
  readonly lastUpdatedAt: Date;

  @ApiPropertyOptional({
    description: 'Timestamp when the DSR request was completed (if applicable).',
    type: Date,
    example: '2023-10-27T14:30:00.000Z',
  })
  @IsOptional()
  @IsDate()
  readonly completedAt?: Date;

  @ApiProperty({
    description: 'Email address of the requester.',
    example: 'user@example.com',
  })
  @IsEmail()
  readonly requesterEmail: string;

  @ApiPropertyOptional({
    description: 'Known identifier for the requester.',
    example: 'user-uuid-xyz',
  })
  @IsOptional()
  @IsString()
  readonly requesterIdentifier?: string;

  @ApiPropertyOptional({
    description: 'Target merchant ID for the DSR request (if applicable).',
    example: 'merchant-uuid-abc',
  })
  @IsOptional()
  @IsString()
  readonly targetMerchantId?: string;

  @ApiPropertyOptional({
    description: 'Additional details provided with the DSR request.',
    example: 'Requesting access to all personal data.',
  })
  @IsOptional()
  @IsString()
  readonly details?: string;

  @ApiPropertyOptional({
    description: 'Notes added by administrators regarding the request.',
    example: 'Identity verified on 2023-10-26. Awaiting data compilation.',
  })
  @IsOptional()
  @IsString()
  readonly adminNotes?: string;
}