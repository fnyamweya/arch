import type { SentryInitConfig } from "./types";

export interface SentryClient {
  setTag(key: string, value: string): void;
  captureException(error: unknown): void;
}

interface RuntimeSentryClient {
  init(config: {
    readonly dsn: string;
    readonly environment: string;
    readonly tracesSampleRate: number;
  }): void;
  setTag(key: string, value: string): void;
  captureException(error: unknown): void;
}

export const createSentryClient = (config: SentryInitConfig): SentryClient => {
  const runtimeSentry = (globalThis as { readonly Sentry?: RuntimeSentryClient }).Sentry;
  if (runtimeSentry !== undefined) {
    runtimeSentry.init({
      dsn: config.dsn,
      environment: config.environment,
      tracesSampleRate: config.tracesSampleRate
    });
    return {
      setTag: (key: string, value: string): void => runtimeSentry.setTag(key, value),
      captureException: (error: unknown): void => runtimeSentry.captureException(error)
    };
  }
  const noop = (): void => {
    void config;
  };

  return {
    setTag: noop,
    captureException: noop
  };
};
