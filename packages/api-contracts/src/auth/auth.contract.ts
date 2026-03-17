export interface VerifyTokenRequest {
  readonly token: string;
  readonly tenantId: string | null;
}

export interface VerifyTokenResponse {
  readonly subject: string;
  readonly tenantId: string | null;
}
