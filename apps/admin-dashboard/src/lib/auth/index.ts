export interface AuthSession {
  readonly userId: string;
  readonly tenantId: string | null;
}
