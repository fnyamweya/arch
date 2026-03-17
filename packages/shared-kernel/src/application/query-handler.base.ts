import type { Query } from "./query.base";

export interface QueryHandler<TQuery extends Query<Record<string, unknown>>, TResult> {
  execute(query: TQuery): Promise<TResult>;
}
