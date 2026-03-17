export interface TenantConfiguredEvent {
  readonly eventName: "tenant.configured";
  readonly tenantId: string;
  readonly occurredAt: string;
}
