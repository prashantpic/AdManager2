import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthTokenResponseDto {
  @ApiProperty({
    description: 'Ad Manager JWT access token.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken: string;

  @ApiPropertyOptional({
    description: 'Ad Manager JWT refresh token (if applicable).',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicmVmcmVzaCI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyfQ.x_j9YJ4jQw_xKjWKl8zJ4J_xKjWKl8zJ4J_xKjWKl8z',
  })
  refreshToken?: string;
}