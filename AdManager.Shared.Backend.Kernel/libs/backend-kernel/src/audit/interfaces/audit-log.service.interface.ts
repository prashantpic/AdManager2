```typescript
import { AuditEntryDto } from '../dtos/audit-entry.dto';

export interface IAuditLogService {
  /**
   * Logs an audit entry.
   * @param entry - The audit entry data transfer object.
   * @returns Promise resolving when the log action is complete.
   */
  logAction(entry: AuditEntryDto): Promise<void>;
}
```