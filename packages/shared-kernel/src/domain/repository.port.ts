export interface RepositoryPort<TEntity, TId extends string> {
  getById(id: TId): Promise<TEntity | null>;
  save(entity: TEntity): Promise<void>;
  delete(id: TId): Promise<void>;
}
