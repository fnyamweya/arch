export interface TrackedOperationResult<T> {
  readonly elapsedMs: number;
  readonly value: T;
}

export const trackOperation = async <T>(operation: () => Promise<T>): Promise<TrackedOperationResult<T>> => {
  const start: number = Date.now();
  const value: T = await operation();
  const elapsedMs: number = Date.now() - start;
  return { elapsedMs, value };
};
