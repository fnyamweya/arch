export abstract class Entity<TId extends string> {
  protected readonly id: TId;

  protected constructor(id: TId) {
    this.id = id;
  }

  public getId(): TId {
    return this.id;
  }
}
