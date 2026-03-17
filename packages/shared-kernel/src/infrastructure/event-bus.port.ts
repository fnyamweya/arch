import type { DomainEvent } from "../domain/domain-event.base";

export interface EventBusPort {
  publish(event: DomainEvent<Record<string, unknown>>): Promise<void>;
  publishBatch(events: ReadonlyArray<DomainEvent<Record<string, unknown>>>): Promise<void>;
}
