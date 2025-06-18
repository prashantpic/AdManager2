import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  Matches,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreatePlatformAdministratorRequestDto {
  @ApiProperty({
    description: 'Username for the new platform administrator. Must be at least 3 characters.',
    example: 'newadmin',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Email address for the new platform administrator.',
    example: 'newadmin@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Password for the new platform administrator. Must include uppercase, lowercase, number, and be at least 8 characters.',
    example: 'P@$$wOrd123',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/, {
    message:
      'Password too weak. Must include uppercase, lowercase, number, and be at least 8 characters.',
  })
  password: string;

  @ApiProperty({
    type: [String],
    required: false,
    default: ['PlatformAdministrator'],
    description: 'Roles to assign to the new platform administrator. Defaults to ["PlatformAdministrator"].',
    example: ['PlatformAdministrator', 'SuperUser'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roles?: string[] = ['PlatformAdministrator'];
}