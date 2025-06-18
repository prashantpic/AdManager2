import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsDate, IsUUID } from 'class-validator';

export class DsrDataExportDto {
  @ApiProperty({
    description: 'Identifier of the DSR request for which data is exported.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID() // Assuming request IDs are UUIDs. Change to IsString if not.
  readonly requestId: string;

  @ApiProperty({
    description: 'Format of the exported data (e.g., "application/json", "text/csv").',
    example: 'application/json',
  })
  @IsString()
  readonly format: string;

  @ApiPropertyOptional({
    description: 'The exported data itself (if small enough) or a reference to it.',
    example: { profile: { name: 'John Doe' }, orders: [{ id: 'order1' }] },
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  readonly data?: any;

  @ApiPropertyOptional({
    description: 'A pre-signed URL for securely downloading the exported data (if large).',
    example: 'https://s3.example.com/dsr-exports/export-xyz.zip?signature=...',
  })
  @IsOptional()
  @IsUrl()
  readonly downloadUrl?: string;

  @ApiPropertyOptional({
    description: 'Expiration date/time for the download URL (if provided).',
    type: Date,
    example: '2023-10-28T12:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  readonly expiresAt?: Date;
}