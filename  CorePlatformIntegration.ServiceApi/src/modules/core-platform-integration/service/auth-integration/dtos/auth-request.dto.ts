import { IsOptional, IsString, MinLength } from 'class-validator';

export class AuthRequestDto {
  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsString()
  @IsOptional()
  @MinLength(1) // Assuming password cannot be empty if provided
  readonly password?: string;

  @IsString()
  @IsOptional()
  readonly token?: string;
}