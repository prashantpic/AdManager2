import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsIn, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export const DSR_ACTION_TYPES = [
  'verify_identity', 'approve_request', 'deny_request',
  'fulfill_access', 'fulfill_portability', 'confirm_rectification',
  'confirm_erasure', 'apply_restriction', 'acknowledge_objection', 'close_request'
] as const;
export type DsrActionType = typeof DSR_ACTION_TYPES[number];

export class DsrActionDto {
  @ApiProperty({
    description: 'Identifier of the DSR request to act upon.',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  readonly requestId: string;

  @ApiProperty({
    description: 'The administrative action to perform on the DSR request.',
    enum: DSR_ACTION_TYPES,
    example: 'approve_request',
  })
  @IsString()
  @IsIn(DSR_ACTION_TYPES as any)
  @IsNotEmpty()
  readonly action: DsrActionType;

  @ApiPropertyOptional({
    description: 'Administrative notes related to this action.',
    example: 'Identity confirmed via internal check. Approved for fulfillment.',
  })
  @IsOptional()
  @IsString()
  readonly notes?: string;

  @ApiPropertyOptional({
    description: 'Reason for denial, if the action is "deny_request".',
    example: 'Unable to verify requester identity.',
  })
  @IsOptional()
  @IsString()
  readonly reasonForDenial?: string;
}