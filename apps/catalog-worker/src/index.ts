import { Hono } from "hono";
import type { CatalogBindings } from "@arch/cloudflare-bindings";
import { createCategory } from "./application/commands/create-category";
import { createProduct } from "./application/commands/create-product";
import { publishProduct } from "./application/commands/publish-product";
import { updateProduct } from "./application/commands/update-product";
import { getProductDetail } from "./application/queries/get-product-detail";
import { listCategories } from "./application/queries/list-categories";
import { searchProducts } from "./application/queries/search-products";
import { D1CategoryRepository } from "./infrastructure/persistence/d1-category.repository";
import { D1ProductRepository } from "./infrastructure/persistence/d1-product.repository";

const app = new Hono<{ Bindings: CatalogBindings }>();

app.get("/health", (c) => c.json({ success: true, data: { service: "catalog-worker", status: "ok" } }));
app.post("/products", async (c) => {
  const body = (await c.req.json()) as {
    readonly tenantId: string;
    readonly vendorId: string;
    readonly title: string;
    readonly slug: string;
  };
  const result = await createProduct(body);
  const repository = new D1ProductRepository(c.env.TENANT_DB);
  await repository.save({
    product: {
      id: result.productId,
      vendorId: body.vendorId,
      title: body.title,
      slug: body.slug,
      status: "DRAFT"
    },
    variants: []
  });
  return c.json({ success: true, data: result }, 201);
});
app.patch("/products/:productId", async (c) => {
  const body = (await c.req.json()) as {
    readonly title: string;
    readonly description: string | null;
  };
  const result = await updateProduct({
    productId: c.req.param("productId"),
    title: body.title,
    description: body.description
  });
  return c.json({ success: true, data: result });
});
app.post("/products/:productId/publish", async (c) => {
  const result = await publishProduct({ productId: c.req.param("productId") });
  return c.json({ success: true, data: result });
});
app.get("/products/:productId", async (c) => {
  const repository = new D1ProductRepository(c.env.TENANT_DB);
  const aggregate = await repository.getById(c.req.param("productId"));
  if (aggregate === null) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Product not found" } }, 404);
  }
  const result = await getProductDetail(aggregate.product.id);
  return c.json({
    success: true,
    data:
      result ?? {
        productId: aggregate.product.id,
        title: aggregate.product.title,
        slug: aggregate.product.slug,
        status: aggregate.product.status
      }
  });
});
app.get("/products", async (c) => {
  const searchTerm: string = c.req.query("q") ?? "";
  const tenantId: string = c.req.header("x-tenant-id") ?? "unknown";
  const result = await searchProducts({ tenantId, searchTerm });
  return c.json({ success: true, data: result });
});
app.post("/categories", async (c) => {
  const body = (await c.req.json()) as {
    readonly name: string;
    readonly slug: string;
    readonly parentCategoryId: string | null;
  };
  const result = await createCategory(body);
  const repository = new D1CategoryRepository(c.env.TENANT_DB);
  await repository.save({
    id: result.categoryId,
    name: body.name,
    slug: body.slug,
    parentCategoryId: body.parentCategoryId
  });
  return c.json({ success: true, data: result }, 201);
});
app.get("/categories", async (c) => {
  const result = await listCategories();
  if (result.length > 0) {
    return c.json({ success: true, data: result });
  }
  const repository = new D1CategoryRepository(c.env.TENANT_DB);
  const first = await repository.getById("default");
  return c.json({
    success: true,
    data:
      first === null
        ? []
        : [
            {
              categoryId: first.id,
              name: first.name,
              slug: first.slug
            }
          ]
  });
});

export default app;
