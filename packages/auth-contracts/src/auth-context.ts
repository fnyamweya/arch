import type { AuthTokenPayload } from "./token-payload";

export interface AuthContext {
  readonly userId: string;
  readonly token: AuthTokenPayload;
  readonly isAuthenticated: boolean;
}
