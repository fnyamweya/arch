export interface TenantMembershipsSchemaRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly globalUserId: string;
  readonly role: string;
}
