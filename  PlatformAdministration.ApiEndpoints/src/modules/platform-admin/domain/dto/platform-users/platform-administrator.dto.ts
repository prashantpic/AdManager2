import { ApiProperty } from '@nestjs/swagger';

export class PlatformAdministratorDto {
  @ApiProperty({ description: "Unique ID of the platform administrator."})
  id: string;

  @ApiProperty({ description: "Username of the platform administrator."})
  username: string;

  @ApiProperty({ description: "Email address of the platform administrator."})
  email: string;

  @ApiProperty({ type: [String], description: "Roles assigned to the platform administrator."})
  roles: string[];

  @ApiProperty({ description: "Indicates if the platform administrator account is active."})
  isActive: boolean;

  @ApiProperty({ required: false, description: "Timestamp of the last login.", type: Date})
  lastLoginAt?: Date;
}