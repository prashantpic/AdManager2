import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsIP } from 'class-validator';

export class ManageConsentDto {
  @ApiProperty({
    description: 'Identifier of the user for whom consent is being managed.',
    example: 'user-uuid-1234',
  })
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @ApiProperty({
    description: 'Type of consent being managed (e.g., "marketing_emails", "third_party_data_sharing").',
    example: 'marketing_emails',
  })
  @IsString()
  @IsNotEmpty()
  readonly consentType: string;

  @ApiProperty({
    description: 'Whether consent is given (true) or withdrawn (false).',
    example: true,
  })
  @IsBoolean()
  readonly isGiven: boolean;

  @ApiProperty({
    description: 'Source from which the consent was obtained (e.g., "signup_form", "preference_center").',
    example: 'preference_center',
  })
  @IsString()
  @IsNotEmpty()
  readonly source: string;

  @ApiPropertyOptional({
    description: 'Version of the DPA or policy to which the user consented.',
    example: 'v1.2',
  })
  @IsOptional()
  @IsString()
  readonly version?: string;

  @ApiPropertyOptional({
    description: 'IP address from which the consent action was performed.',
    example: '192.168.1.100',
  })
  @IsOptional()
  @IsIP()
  readonly ipAddress?: string;

  @ApiPropertyOptional({
    description: 'User agent string of the client used for the consent action.',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  })
  @IsOptional()
  @IsString()
  readonly userAgent?: string;
}