import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsArray, ValidateNested } from 'class-validator';
import { UserAccessReportQueryDto } from './user-access-report-query.dto';
import { UserAccessEntryDto } from './user-access-entry.dto'; // Assumed to be generated in a future step or available

export class UserAccessReportDto {
  @ApiProperty({
    description: 'List of user access report entries.',
    type: () => [UserAccessEntryDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserAccessEntryDto)
  readonly reportEntries: UserAccessEntryDto[];

  @ApiProperty({
    description: 'Timestamp when the report was generated.',
    type: Date,
    example: '2023-02-01T11:00:00.000Z',
  })
  @IsDate()
  readonly generatedAt: Date;

  @ApiProperty({
    description: 'Query parameters used to generate this report.',
    type: () => UserAccessReportQueryDto,
  })
  @ValidateNested()
  @Type(() => UserAccessReportQueryDto)
  readonly queryParameters: UserAccessReportQueryDto;
}