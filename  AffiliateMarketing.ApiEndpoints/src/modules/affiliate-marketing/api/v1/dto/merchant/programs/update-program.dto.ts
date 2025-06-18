import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';

export class UpdateProgramDto {
  @ApiPropertyOptional({
    description: 'The updated name of the affiliate program.',
    example: 'Autumn Sale Affiliate Program',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The updated description of the affiliate program.',
    example: 'Promote our autumn collection with new commission rates!',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated cookie window in days for tracking affiliate referrals.',
    example: 45,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  cookieWindowDays?: number;

  @ApiPropertyOptional({
    description: 'Set whether the program is active or inactive.',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}