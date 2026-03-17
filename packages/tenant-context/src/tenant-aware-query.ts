import type { TenantContext } from "./types";

export interface TenantAwareQueryExecutor {
  execute<T>(tenantContext: TenantContext, sql: string, params?: ReadonlyArray<unknown>): Promise<T>;
}
