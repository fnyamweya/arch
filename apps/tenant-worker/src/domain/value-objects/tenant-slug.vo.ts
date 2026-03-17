export type TenantSlug = string & { readonly __brand: "TenantSlug" };

export const toTenantSlug = (value: string): TenantSlug => {
  if (!/^[a-z0-9-]+$/.test(value)) {
    throw new Error("tenant slug must be lowercase alphanumeric and dashes");
  }
  return value as TenantSlug;
};
