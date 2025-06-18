import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsEmail, IsOptional, IsString, IsObject, IsNotEmpty } from 'class-validator';

export const DSR_REQUEST_TYPES = ['access', 'rectification', 'erasure', 'portability', 'restriction', 'objection'] as const;
export type DsrRequestType = typeof DSR_REQUEST_TYPES[number];


export class SubmitDsrDto {
  @ApiProperty({
    description: 'Type of Data Subject Right request.',
    enum: DSR_REQUEST_TYPES,
    example: 'access',
  })
  @IsString()
  @IsIn(DSR_REQUEST_TYPES as any) // class-validator needs `any` for `readonly string[]`
  @IsNotEmpty()
  readonly requestType: DsrRequestType;

  @ApiProperty({
    description: 'Email address of the requester.',
    example: 'user@example.com',
  })
  @IsEmail()
  readonly requesterEmail: string;

  @ApiPropertyOptional({
    description: 'Known identifier for the requester (e.g., user ID).',
    example: 'user-uuid-xyz',
  })
  @IsOptional()
  @IsString()
  readonly requesterIdentifier?: string;

  @ApiPropertyOptional({
    description: 'Additional details or context for the DSR request.',
    example: 'Please provide all data related to my account activity in the last 6 months.',
  })
  @IsOptional()
  @IsString()
  readonly details?: string;

  @ApiPropertyOptional({
    description: 'Target merchant ID, if the DSR request is specific to a merchant in a multi-tenant system.',
    example: 'merchant-uuid-abc',
  })
  @IsOptional()
  @IsString()
  readonly targetMerchantId?: string;

  @ApiPropertyOptional({
    description: 'Data for rectification, if requestType is "rectification". Key-value pairs of fields to update.',
    example: { address: '123 New Main St', postalCode: '90210' },
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  readonly dataForRectification?: Record<string, any>;
}