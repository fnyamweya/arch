export interface ApiSuccessEnvelope<T> {
  readonly success: true;
  readonly data: T;
  readonly meta?: Readonly<Record<string, unknown>>;
}

export interface ApiErrorEnvelope {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: Readonly<Record<string, unknown>>;
  };
}

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;
