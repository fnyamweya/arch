import type { TenantContext } from "./types";

export interface RequestWithTenantContext extends Request {
  readonly tenantContext?: TenantContext;
}

export const withTenantContext = (request: Request, tenantContext: TenantContext): RequestWithTenantContext => {
  const augmentedRequest: RequestWithTenantContext = Object.assign(request, { tenantContext });
  return augmentedRequest;
};
