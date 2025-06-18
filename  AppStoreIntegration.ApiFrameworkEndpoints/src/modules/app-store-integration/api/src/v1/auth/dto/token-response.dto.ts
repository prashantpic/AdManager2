import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @description Data Transfer Object for OAuth 2.0 token responses.
 * This DTO defines the structure of successful responses from the `/token` endpoint.
 */
export class TokenResponseDto {
  @ApiProperty({
    description: 'The access token issued by the authorization server.',
    example: '2YotnFZFEjr1zCsicMWpAA',
  })
  access_token: string;

  @ApiProperty({
    description: 'The type of the token issued (e.g., Bearer).',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'The lifetime in seconds of the access token.',
    example: 3600,
  })
  expires_in: number;

  @ApiPropertyOptional({
    description: 'The refresh token, which can be used to obtain new access tokens using the same authorization grant.',
    example: 'tGzv3JOkF0XG5Qx2TlKWIA',
  })
  refresh_token?: string;

  @ApiPropertyOptional({
    description: 'The scope of the access token as described by RFC 6749, space-delimited.',
    example: 'campaigns:read products:read',
  })
  scope?: string;
}