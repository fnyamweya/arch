export interface PaginationRequest {
  readonly page: number;
  readonly pageSize: number;
}

export interface PaginationMeta {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
}
