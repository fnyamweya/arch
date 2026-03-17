import { Webhook } from "svix";

export interface ClerkWebhookEvent {
  readonly type: string;
  readonly data: Readonly<Record<string, unknown>>;
}

const getHeader = (request: Request, headerName: string): string => {
  const value: string | null = request.headers.get(headerName);
  if (value === null || value.length === 0) {
    throw new Error(`Missing required header: ${headerName}`);
  }
  return value;
};

export const parseClerkWebhook = async (
  request: Request,
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
