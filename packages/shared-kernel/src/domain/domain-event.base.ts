export interface DomainEvent<TPayload extends Record<string, unknown>> {
  readonly eventId: string;
  readonly eventName: string;
  readonly aggregateId: string;
  readonly occurredAt: string;
  readonly payload: Readonly<TPayload>;
}
