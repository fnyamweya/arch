export interface Command<TPayload extends Record<string, unknown>> {
  readonly commandName: string;
  readonly payload: Readonly<TPayload>;
}
