import { v4 as uuidv4 } from 'uuid';

export interface IBaseEventPayload {
    // Base payload can be empty or have common fields
}

export interface IBaseEvent<P extends IBaseEventPayload = IBaseEventPayload> {
  readonly eventId: string; // UUID
  readonly eventType: string; // e.g., 'CAMPAIGN_CREATED', 'USER_REGISTERED'
  readonly eventVersion: string; // e.g., '1.0', '1.1'
  readonly timestamp: string; // ISO 8601 format
  readonly sourceService: string; // Name of the microservice that published the event
  readonly correlationId?: string; // For tracing requests across services
  readonly userId?: string; // User who initiated the action, if applicable
  readonly merchantId?: string; // Merchant context, if applicable
  readonly payload: P;
}

// Optional: A base class to help create events
export abstract class BaseEvent<P extends IBaseEventPayload> implements IBaseEvent<P> {
    readonly eventId: string;
    abstract readonly eventType: string; // To be defined by concrete classes
    readonly eventVersion: string;
    readonly timestamp: string;
    readonly sourceService: string;
    readonly correlationId?: string;
    readonly userId?: string;
    readonly merchantId?: string;
    readonly payload: P;

    constructor(
        sourceService: string,
        payload: P,
        options?: {
            eventVersion?: string;
            correlationId?: string;
            userId?: string;
            merchantId?: string;
        }
    ) {
        this.eventId = uuidv4();
        this.eventVersion = options?.eventVersion || '1.0';
        this.timestamp = new Date().toISOString();
        this.sourceService = sourceService;
        this.payload = payload;
        this.correlationId = options?.correlationId;
        this.userId = options?.userId;
        this.merchantId = options?.merchantId;
    }
}