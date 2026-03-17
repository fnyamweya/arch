import type { LoggerContext, LoggerPort } from "./types";

const serialize = (level: string, message: string, context: LoggerContext | undefined): string => {
  return JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    context: context ?? {}
  });
};

export class StructuredLogger implements LoggerPort {
  public info(message: string, context?: LoggerContext): void {
    console.info(serialize("info", message, context));
  }

  public warn(message: string, context?: LoggerContext): void {
    console.warn(serialize("warn", message, context));
  }

  public error(message: string, context?: LoggerContext): void {
    console.error(serialize("error", message, context));
  }
}
