import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn, IsNotEmpty, IsUrl } from 'class-validator';

/**
 * @description Data Transfer Object for requesting an OAuth 2.0 token.
 * This DTO defines the structure for requests to the `/token` endpoint.
 */
export class TokenRequestDto {
  @ApiProperty({
    description: 'The grant type.',
    enum: ['authorization_code', 'refresh_token'],
    example: 'authorization_code',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['authorization_code', 'refresh_token'])
  grant_type: 'authorization_code' | 'refresh_token';

  @ApiPropertyOptional({
    description: 'The authorization code received from the authorization server. Required for `authorization_code` grant type.',
    example: 'SplxlOBeZQQYbYS6WxSbIA',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: 'The redirect URI that was used in the authorization request. Required if it was included in the authorization request for `authorization_code` grant type.',
    example: 'https://client.example.com/cb',
  })
  @IsOptional()
  @IsUrl()
  redirect_uri?: string;

  @ApiProperty({
    description: 'The client identifier.',
    example: 's6BhdRkqt3',
  })
  @IsNotEmpty()
  @IsString()
  client_id: string;

  @ApiPropertyOptional({
    description: 'The client secret. Required for confidential clients.',
    example: 'Z2V0YVJlc3Bhc3N3b3JkMQ==',
  })
  @IsOptional()
  @IsString()
  client_secret?: string;

  @ApiPropertyOptional({
    description: 'The refresh token. Required for `refresh_token` grant type.',
    example: 'tGzv3JOkF0XG5Qx2TlKWIA',
  })
  @IsOptional()
  @IsString()
  refresh_token?: string;

  @ApiPropertyOptional({
    description: 'The PKCE code verifier. Required for `authorization_code` grant type if a `code_challenge` was used in the authorization request.',
    example: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
  })
  @IsOptional()
  @IsString()
  code_verifier?: string;
}