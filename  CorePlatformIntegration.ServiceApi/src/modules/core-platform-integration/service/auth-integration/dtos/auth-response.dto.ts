import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class AuthResponseDto {
  @IsBoolean()
  @IsDefined()
  readonly isAuthenticated: boolean;

  @IsString()
  @IsOptional()
  readonly userId?: string;

  @IsString()
  @IsOptional()
  readonly sessionToken?: string;

  @IsString()
  @IsOptional()
  readonly errorMessage?: string;
}