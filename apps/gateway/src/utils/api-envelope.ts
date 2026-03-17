import type { ApiEnvelope, ApiErrorEnvelope, ApiSuccessEnvelope } from "@arch/api-contracts";

export const successEnvelope = <T>(data: T, meta?: Readonly<Record<string, unknown>>): ApiSuccessEnvelope<T> => {
  return {
    success: true,
    data,
    meta
  };
};

export const errorEnvelope = (
  code: string,
  message: string,
  details?: Readonly<Record<string, unknown>>
): ApiErrorEnvelope => {
  return {
    success: false,
    error: {
      code,
      message,
      details
    }
  };
};

export const toJson = <T>(envelope: ApiEnvelope<T>, status: number): Response => {
  return new Response(JSON.stringify(envelope), {
    status,
    headers: {
      "content-type": "application/json"
    }
  });
};
