import { SQSClient, SendMessageCommand, SendMessageCommandInput } from '@aws-sdk/client-sqs';
import { v4 as uuidv4 } from 'uuid';
import { IAuditClient } from './audit.client.interface';
import { AuditLogEntryDto } from './dtos/audit-log.dto';
import { ILogger, LoggerService, LogLevel } from '@admanager/logger';

export interface AuditClientOptions {
  sqsQueueUrl: string;
  awsRegion: string;
  serviceName: string; // The name of the service using this audit client
  logger?: ILogger; // Optional logger instance for the audit client itself
  // fifoQueue?: boolean; // If the SQS queue is FIFO
  // messageGroupIdProvider?: (entry: AuditLogEntryDto) => string; // For FIFO queues
}

export class AuditClientService implements IAuditClient {
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;
  private readonly serviceName: string;
  private readonly logger: ILogger;
  // private readonly fifoQueue: boolean;
  // private readonly messageGroupIdProvider?: (entry: AuditLogEntryDto) => string;

  constructor(options: AuditClientOptions) {
    this.queueUrl = options.sqsQueueUrl;
    this.serviceName = options.serviceName;
    this.sqsClient = new SQSClient({ region: options.awsRegion });
    
    if (options.logger) {
      this.logger = options.logger;
    } else {
      // Create a default internal logger for the AuditClientService if none is provided
      this.logger = new LoggerService({
        serviceName: `@admanager/audit-client-internal-[${this.serviceName}]`, // Distinguish internal logs
        level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
      });
    }
    // this.fifoQueue = options.fifoQueue || false;
    // this.messageGroupIdProvider = options.messageGroupIdProvider;
  }

  async log(entryData: Omit<AuditLogEntryDto, 'timestamp' | 'id' | 'serviceName'>): Promise<void> {
    const auditEntry: AuditLogEntryDto = {
      id: uuidv4(),
      timestamp: new Date(),
      serviceName: this.serviceName,
      ...entryData,
    };

    const params: SendMessageCommandInput = {
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(auditEntry),
    };

    // // If FIFO queue, add MessageGroupId and MessageDeduplicationId
    // if (this.fifoQueue) {
    //   params.MessageGroupId = this.messageGroupIdProvider 
    //     ? this.messageGroupIdProvider(auditEntry) 
    //     : auditEntry.userId || auditEntry.resourceId || auditEntry.action || 'default-group';
    //   // For FIFO, MessageDeduplicationId can be based on content or a unique ID like auditEntry.id
    //   params.MessageDeduplicationId = auditEntry.id; 
    // }

    try {
      const command = new SendMessageCommand(params);
      await this.sqsClient.send(command);
      this.logger.debug(`Audit log entry sent successfully to SQS queue: ${this.queueUrl}`, { 
        auditId: auditEntry.id, 
        action: auditEntry.action,
        resourceType: auditEntry.resourceType,
        resourceId: auditEntry.resourceId
      });
    } catch (error) {
      this.logger.error('Failed to send audit log entry to SQS', error, { 
        auditEntry,
        queueUrl: this.queueUrl 
      });
      // Decision on whether to re-throw or handle silently depends on requirements.
      // For audit logs, often it's preferred not to break the main application flow.
      // A dead-letter queue (DLQ) on the SQS queue itself is recommended for SQS send failures.
    }
  }
}