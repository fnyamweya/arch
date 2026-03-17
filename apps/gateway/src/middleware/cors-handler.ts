import type { MiddlewareHandler } from "hono";

export const corsHandler: MiddlewareHandler = async (c, next): Promise<void> => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (c.req.method === "OPTIONS") {
    c.status(204);
    return;
  }
  await next();
};
