export interface Query<TPayload extends Record<string, unknown>> {
  readonly queryName: string;
  readonly payload: Readonly<TPayload>;
}
