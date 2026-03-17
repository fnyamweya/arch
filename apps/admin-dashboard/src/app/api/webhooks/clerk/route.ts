export async function POST(request: Request): Promise<Response> {
  const payload: unknown = await request.json();
  void payload;
  return new Response(JSON.stringify({ success: true }), {
    headers: { "content-type": "application/json" }
  });
}
