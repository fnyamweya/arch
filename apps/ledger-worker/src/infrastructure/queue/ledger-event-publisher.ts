export interface LedgerEvent {
  readonly type: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export const publishLedgerEvent = async (queue: Queue, event: LedgerEvent): Promise<void> => {
  await queue.send(event);
};
