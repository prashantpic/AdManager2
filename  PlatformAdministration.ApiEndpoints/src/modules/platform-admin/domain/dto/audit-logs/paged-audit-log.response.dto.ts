import { ApiProperty } from '@nestjs/swagger';
import { PagedResponseDto } from '../common/paged-response.dto';
import { AuditLogEntryResponseDto } from './audit-log-entry.response.dto';

export class PagedAuditLogResponseDto extends PagedResponseDto<AuditLogEntryResponseDto> {
  @ApiProperty({
    type: [AuditLogEntryResponseDto],
    description: 'Array of audit log entries for the current page.',
  })
  data: AuditLogEntryResponseDto[];
}