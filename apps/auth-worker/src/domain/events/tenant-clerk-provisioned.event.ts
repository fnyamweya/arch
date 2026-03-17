export interface TenantClerkProvisionedEvent {
  readonly eventName: "auth.tenant.clerk.provisioned";
  readonly tenantId: string;
  readonly occurredAt: string;
}
