import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class IdParamDto {
  @ApiProperty({
    description: 'Unique identifier (UUID v4) of the resource',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'ID must be a valid UUID version 4.' })
  @IsNotEmpty({ message: 'ID should not be empty.' })
  id: string;
}