export interface TenantInfrastructureReadyEvent {
  readonly eventName: "tenant.infrastructure.ready";
  readonly tenantId: string;
  readonly occurredAt: string;
}
