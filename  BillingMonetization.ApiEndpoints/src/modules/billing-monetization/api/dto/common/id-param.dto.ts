import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdParamDto {
  @ApiProperty({
    description: 'The UUID of the resource.',
    example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'ID must be a valid UUID version 4.' })
  id: string;
}