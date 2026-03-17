export interface RoleAssignedEvent {
  readonly eventName: "auth.role.assigned";
  readonly tenantId: string;
  readonly userId: string;
  readonly role: string;
  readonly occurredAt: string;
}
