export type ClerkOrgId = string & { readonly __brand: "ClerkOrgId" };

export const toClerkOrgId = (value: string): ClerkOrgId => {
  if (value.length === 0) {
    throw new Error("clerk org id is required");
  }
  return value as ClerkOrgId;
};
