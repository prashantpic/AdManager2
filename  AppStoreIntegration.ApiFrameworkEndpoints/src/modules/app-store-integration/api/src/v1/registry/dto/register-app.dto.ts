import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsEmail,
  IsUrl,
  ArrayNotEmpty,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

/**
 * @description Data Transfer Object for registering a new third-party application.
 * Defines the payload structure for app registration requests.
 */
export class RegisterAppDto {
  @ApiProperty({
    description: 'The name of the application.',
    example: 'My Awesome Integration App',
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  appName: string;

  @ApiProperty({
    description: 'An array of redirect URIs for OAuth 2.0 flows. Must be HTTPS.',
    example: ['https://client.example.com/callback1', 'https://client.example.com/callback2'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({ require_tld: true, protocols: ['https'] }, { each: true })
  redirectUris: string[];

  @ApiProperty({
    description: 'An array of OAuth 2.0 scopes the application requests permission for.',
    example: ['campaigns:read', 'products:manage', 'webhooks:subscribe'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty() // Assuming scopes are required for registration
  @IsString({ each: true })
  scopes: string[];

  @ApiProperty({
    description: 'The email address of the developer or a contact point for the application.',
    example: 'developer@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  developerEmail: string;
}