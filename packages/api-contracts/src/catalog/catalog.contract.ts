export interface CreateProductRequest {
  readonly tenantId: string;
  readonly vendorId: string;
  readonly title: string;
  readonly slug: string;
}

export interface ProductResponse {
  readonly productId: string;
  readonly title: string;
  readonly slug: string;
  readonly status: string;
}
