import { Webhook } from "svix";

export interface ClerkWebhookEvent {
  readonly type: string;
  readonly data: Readonly<Record<string, unknown>>;
}

interface WebhookRequest {
  readonly headers: Headers;
  text(): Promise<string>;
}

const getHeader = (request: WebhookRequest, headerName: string): string => {
  const value: string | null = request.headers.get(headerName);
  if (value === null || value.length === 0) {
    throw new Error(`Missing required header: ${headerName}`);
  }
  return value;
};

export const parseClerkWebhook = async (
  request: WebhookRequest,
  webhookSecret: string
): Promise<ClerkWebhookEvent> => {
  const payloadText: string = await request.text();
  const svixId: string = getHeader(request, "svix-id");
  const svixTimestamp: string = getHeader(request, "svix-timestamp");
  const svixSignature: string = getHeader(request, "svix-signature");
  const webhook = new Webhook(webhookSecret);
  const verifiedPayload = webhook.verify(payloadText, {
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": svixSignature
  }) as {
    readonly type?: string;
    readonly data?: Readonly<Record<string, unknown>>;
  };
  return {
    type: verifiedPayload.type ?? "unknown",
    data: verifiedPayload.data ?? {}
  };
};
