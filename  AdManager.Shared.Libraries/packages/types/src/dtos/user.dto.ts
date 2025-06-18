import { IsEmail, IsNotEmpty, IsString, IsUUID, IsArray, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';

export class UserDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
  
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];

  @IsOptional()
  @IsUUID()
  merchantId?: string;

  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;
}

export class UserProfileDto extends UserDto {
  // Additional profile-specific fields can be added here
  // For example:
  // @IsOptional()
  // @IsString()
  // avatarUrl?: string;
}