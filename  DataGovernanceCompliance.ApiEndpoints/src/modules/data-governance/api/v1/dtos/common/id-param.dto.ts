import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class IdParamDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID('4', { message: 'ID must be a valid UUID version 4.' })
  @ApiProperty({
    description: 'The unique identifier (UUID v4) of the resource.',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    format: 'uuid',
  })
  readonly id: string;
}