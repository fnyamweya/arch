export interface OrderEvent {
  readonly type: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export const publishOrderEvent = async (
  queue: Queue,
  event: OrderEvent
): Promise<void> => {
  await queue.send(event);
};
