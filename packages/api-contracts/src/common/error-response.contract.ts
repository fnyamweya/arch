export interface ErrorResponseContract {
  readonly code: string;
  readonly message: string;
  readonly fieldErrors?: Readonly<Record<string, string>>;
}
