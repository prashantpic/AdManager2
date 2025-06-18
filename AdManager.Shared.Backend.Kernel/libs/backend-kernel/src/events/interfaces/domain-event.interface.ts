```typescript
export interface IDomainEvent<TPayload = any> {
  /**
   * The unique identifier of the aggregate root that this event pertains to.
   */
  readonly aggregateId: string | number;

  /**
   * The date and time when the event occurred.
   */
  readonly dateTimeOccurred: Date;

  /**
   * The name of the event, unique within the bounded context.
   * e.g., 'CampaignCreatedEvent', 'ProductPriceChangedEvent'
   */
  readonly eventName: string;
  
  /**
   * The version of this event schema.
   */
  readonly eventVersion: number;

  /**
   * The payload of the event, containing event-specific data.
   */
  readonly payload: TPayload;

  /**
   * Optional: Correlation ID to link related events.
   */
  readonly correlationId?: string;

  /**
   * Optional: Causation ID, ID of the command or event that caused this event.
   */
  readonly causationId?: string;
}
```