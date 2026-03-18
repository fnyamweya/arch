import type { EmailAddress } from "../value-objects/email.vo";

export interface GlobalUserEntity {
  readonly id: string;
  readonly email: EmailAddress | null;
}
