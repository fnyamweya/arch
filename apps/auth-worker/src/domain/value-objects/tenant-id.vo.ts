export type TenantId = string & { readonly __brand: "TenantId" };

export const toTenantId = (value: string): TenantId => {
  if (value.length === 0) {
    throw new Error("tenant id is required");
  }
  return value as TenantId;
};
