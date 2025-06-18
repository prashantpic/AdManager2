import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class SyncAudienceRequestDto {
  @ApiProperty({ type: [String], description: 'List of Ad Network IDs to synchronize the audience with. This can include new networks or re-sync existing ones.' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  adNetworkIds: string[];
}