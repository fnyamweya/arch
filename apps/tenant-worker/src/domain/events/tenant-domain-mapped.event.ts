export interface TenantDomainMappedEvent {
  readonly eventName: "tenant.domain.mapped";
  readonly tenantId: string;
  readonly domain: string;
  readonly occurredAt: string;
}
