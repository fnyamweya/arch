import type { DomainEvent } from "./domain-event.base";
import { Entity } from "./entity.base";

export abstract class AggregateRoot<TId extends string> extends Entity<TId> {
  private readonly domainEvents: DomainEvent<Record<string, unknown>>[] = [];

  protected addDomainEvent(event: DomainEvent<Record<string, unknown>>): void {
    this.domainEvents.push(event);
  }

  public pullDomainEvents(): ReadonlyArray<DomainEvent<Record<string, unknown>>> {
    const copied: DomainEvent<Record<string, unknown>>[] = [...this.domainEvents];
    this.domainEvents.length = 0;
    return copied;
  }
}
