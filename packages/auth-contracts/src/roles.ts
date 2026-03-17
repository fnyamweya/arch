export const PLATFORM_ROLE = {
  PLATFORM_ADMIN: "PLATFORM_ADMIN"
} as const;

export const TENANT_ROLE = {
  TENANT_ADMIN: "TENANT_ADMIN",
  VENDOR_OWNER: "VENDOR_OWNER",
  VENDOR_STAFF: "VENDOR_STAFF",
  CUSTOMER: "CUSTOMER"
} as const;

export type PlatformRole = (typeof PLATFORM_ROLE)[keyof typeof PLATFORM_ROLE];
export type TenantRole = (typeof TENANT_ROLE)[keyof typeof TENANT_ROLE];
