export async function GET(): Promise<Response> {
  return new Response(JSON.stringify({ success: true, data: { service: "storefront" } }), {
    headers: { "content-type": "application/json" }
  });
}
