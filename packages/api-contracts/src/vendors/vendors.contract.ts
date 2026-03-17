export interface RegisterVendorRequest {
  readonly tenantId: string;
  readonly displayName: string;
  readonly businessName: string;
}

export interface VendorResponse {
  readonly vendorId: string;
  readonly displayName: string;
  readonly status: string;
}
