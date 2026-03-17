export interface CartLineItem {
  readonly productId: string;
  readonly quantity: number;
}

export class CartDurableObject {
  private readonly state: DurableObjectState;

  public constructor(state: DurableObjectState) {
    this.state = state;
  }

  public async fetch(request: Request): Promise<Response> {
    if (request.method === "GET") {
      const items: ReadonlyArray<CartLineItem> =
        (await this.state.storage.get<ReadonlyArray<CartLineItem>>("items")) ?? [];
      return new Response(JSON.stringify({ success: true, data: { items } }), {
        headers: { "content-type": "application/json" }
      });
    }
    if (request.method === "PUT") {
      const payload: unknown = await request.json();
      const body = payload as { readonly items?: ReadonlyArray<CartLineItem> };
      const items: ReadonlyArray<CartLineItem> = body.items ?? [];
      await this.state.storage.put("items", items);
      return new Response(JSON.stringify({ success: true, data: { updated: true } }), {
        headers: { "content-type": "application/json" }
      });
    }
    return new Response("Method Not Allowed", { status: 405 });
  }
}
