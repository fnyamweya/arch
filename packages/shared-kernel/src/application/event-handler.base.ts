import type { DomainEvent } from "../domain/domain-event.base";

export interface EventHandler<TEvent extends DomainEvent<Record<string, unknown>>> {
  handle(event: TEvent): Promise<void>;
}
