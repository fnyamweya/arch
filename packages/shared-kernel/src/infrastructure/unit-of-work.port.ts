export interface UnitOfWorkPort {
  execute<T>(operation: () => Promise<T>): Promise<T>;
}
