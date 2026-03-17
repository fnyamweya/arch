import { createRemoteJWKSet, jwtVerify } from "jose";

export interface ClerkJwtVerificationResult {
  readonly isValid: boolean;
  readonly subject: string | null;
  readonly payload: Readonly<Record<string, unknown>> | null;
  readonly reason: string | null;
}

export const verifyClerkJwt = async (
  token: string,
  jwksUrl: string
): Promise<ClerkJwtVerificationResult> => {
  try {
    const jwks = createRemoteJWKSet(new URL(jwksUrl));
    const verification = await jwtVerify(token, jwks);
    const subject: string | null = typeof verification.payload.sub === "string" ? verification.payload.sub : null;
    return {
      isValid: subject !== null,
      subject,
      payload: verification.payload as Readonly<Record<string, unknown>>,
      reason: subject === null ? "JWT payload missing subject" : null
    };
  } catch (error) {
    return {
      isValid: false,
      subject: null,
      payload: null,
      reason: error instanceof Error ? error.message : "Unknown token verification error"
    };
  }
};
