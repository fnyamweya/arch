export async function GET(): Promise<Response> {
  return new Response(JSON.stringify({ success: true, data: { service: "vendor-dashboard" } }), {
    headers: { "content-type": "application/json" }
  });
}
