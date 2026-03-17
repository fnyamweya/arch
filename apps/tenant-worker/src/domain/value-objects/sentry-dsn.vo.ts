export type SentryDsn = string & { readonly __brand: "SentryDsn" };

export const toSentryDsn = (value: string): SentryDsn => {
  if (!value.startsWith("https://")) {
    throw new Error("sentry dsn must be https");
  }
  return value as SentryDsn;
};
