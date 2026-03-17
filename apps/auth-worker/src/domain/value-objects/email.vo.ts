export type EmailAddress = string & { readonly __brand: "EmailAddress" };

export const toEmailAddress = (value: string): EmailAddress => {
  if (!value.includes("@")) {
    throw new Error("invalid email address");
  }
  return value as EmailAddress;
};
