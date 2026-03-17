export type ClerkUserId = string & { readonly __brand: "ClerkUserId" };

export const toClerkUserId = (value: string): ClerkUserId => {
  if (value.length === 0) {
    throw new Error("clerk user id is required");
  }
  return value as ClerkUserId;
};
