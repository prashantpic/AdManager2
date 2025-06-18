import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsUrl,
  IsOptional,
  Length,
  MinLength,
  IsUUID,
  IsBoolean,
  IsIn,
} from 'class-validator';

export class AffiliateRegistrationRequestDto {
  @ApiProperty({
    description: 'ID of the affiliate program to apply for.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID('4')
  @IsNotEmpty()
  programId: string;

  @ApiProperty({
    description: 'Full name of the applicant.',
    example: 'Alice Wonderland',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address of the applicant.',
    example: 'alice.wonderland@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: "Applicant's primary website or blog URL for promotion.",
    example: 'https://alicesadventures.com',
  })
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @ApiPropertyOptional({
    description: 'Brief description of how the applicant plans to promote the products/services.',
    example: 'Through blog posts on alicesadventures.com and social media channels focusing on travel and lifestyle.',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @Length(10, 500)
  promotionalMethods?: string;

  @ApiProperty({
    description: 'Password for the new affiliate account.',
    example: 'P@$$wOrd123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Indicates if the applicant has agreed to the terms and conditions.',
    example: true,
  })
  @IsBoolean()
  @IsIn([true], { message: 'Agreement to terms is required.' })
  agreedToTerms: boolean;
}