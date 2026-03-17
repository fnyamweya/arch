import type { ClerkUserId } from "../value-objects/clerk-user-id.vo";
import type { EmailAddress } from "../value-objects/email.vo";

export interface GlobalUserEntity {
  readonly id: string;
  readonly clerkUserId: ClerkUserId;
  readonly email: EmailAddress | null;
}
