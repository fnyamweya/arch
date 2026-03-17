export interface TenantSuspendedEvent {
  readonly eventName: "tenant.suspended";
  readonly tenantId: string;
  readonly reason: string;
  readonly occurredAt: string;
}
