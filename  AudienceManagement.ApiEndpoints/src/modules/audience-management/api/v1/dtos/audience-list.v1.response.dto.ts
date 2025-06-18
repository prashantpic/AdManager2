import { ApiProperty } from '@nestjs/swagger';
import { AudienceResponseDto } from './audience.v1.response.dto';

export class AudienceListResponseDto {
  @ApiProperty({ type: () => [AudienceResponseDto], description: 'Array of audience objects.' })
  data: AudienceResponseDto[];

  @ApiProperty({ description: 'Total number of audiences matching the query.' })
  total: number;

  @ApiProperty({ description: 'Current page number.' })
  page: number;

  @ApiProperty({ description: 'Number of items per page.' })
  limit: number;
}