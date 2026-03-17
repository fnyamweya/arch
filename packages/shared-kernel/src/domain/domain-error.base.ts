export interface DomainErrorShape {
  readonly code: string;
  readonly message: string;
  readonly context?: Readonly<Record<string, unknown>>;
}

export class DomainError extends Error {
  public readonly code: string;
  public readonly context?: Readonly<Record<string, unknown>>;

  public constructor(shape: DomainErrorShape) {
    super(shape.message);
    this.name = "DomainError";
    this.code = shape.code;
    this.context = shape.context;
  }
}

export type Result<T, E extends DomainError = DomainError> =
  | { readonly success: true; readonly value: T }
  | { readonly success: false; readonly error: E };
