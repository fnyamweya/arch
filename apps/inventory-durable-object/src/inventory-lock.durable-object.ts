export class InventoryLockDurableObject {
  private readonly state: DurableObjectState;

  public constructor(state: DurableObjectState) {
    this.state = state;
  }

  public async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const payload: unknown = await request.json();
    const body = payload as { readonly key?: string };
    const key: string = body.key ?? "default";
    const current: boolean = (await this.state.storage.get<boolean>(`lock:${key}`)) ?? false;
    if (current) {
      return new Response(JSON.stringify({ success: false, error: { code: "LOCKED", message: "Inventory lock exists" } }), {
        status: 409,
        headers: { "content-type": "application/json" }
      });
    }
    await this.state.storage.put(`lock:${key}`, true);
    return new Response(JSON.stringify({ success: true, data: { key } }), {
      headers: { "content-type": "application/json" }
    });
  }
}
