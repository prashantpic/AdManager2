```typescript
export interface IIntegrationEvent<TPayload = any> {
  /**
   * A unique identifier for this specific event instance.
   */
  readonly eventId: string; // e.g., a UUID

  /**
   * The name of the event, globally unique or namespaced.
   * e.g., 'admanager.campaign.v1.created', 'platform.user.v1.updated'
   */
  readonly eventName: string;

  /**
   * The version of this event schema.
   */
  readonly eventVersion: number;

  /**
   * The date and time when the event occurred, in UTC.
   */
  readonly occurredOn: Date;

  /**
   * The payload of the event, containing event-specific data.
   */
  readonly payload: TPayload;
  
  /**
   * ID for tracing requests across multiple services.
   */
  readonly correlationId?: string;

  /**
   * Name of the service that published this event.
   */
  readonly sourceService: string;

  /**
   * Optional: User ID of the user who initiated the action leading to this event.
   */
  readonly userId?: string; 
}
```