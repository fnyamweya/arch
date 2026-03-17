export interface TenantProvisionedEvent {
  readonly eventName: "tenant.provisioned";
  readonly tenantId: string;
  readonly occurredAt: string;
}
