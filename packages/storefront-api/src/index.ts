import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import { z } from "zod";
import {
  createStorefrontSchema,
  updateStorefrontSchema,
  createDomainMappingSchema,
  createThemeSchema,
  createThemeVersionSchema,
  createThemeTokenSetSchema,
  createLayoutTemplateSchema,
  createLayoutVersionSchema,
  createPageDefinitionSchema,
  createPageVersionSchema,
  pageRouteSchema,
  createBlockDefinitionSchema,
  createBlockVersionSchema,
  createContentEntrySchema,
  updateContentEntrySchema,
  createNavigationMenuSchema,
  createSeoProfileSchema,
  createRedirectRuleSchema,
  createPreviewSessionSchema,
  createPublishJobSchema,
  paginationSchema,
} from "@arch/storefront-validation";
import type {
  StorefrontAdminService,
  ThemeAdminService,
  LayoutAdminService,
  PageAdminService,
  BlockAdminService,
  ContentAdminService,
  SeoAdminService,
  PublishService,
  PreviewService,
} from "@arch/storefront-admin";

// ─── Types ───

export interface StorefrontApiDeps {
  storefrontAdmin: StorefrontAdminService;
  themeAdmin: ThemeAdminService;
  layoutAdmin: LayoutAdminService;
  pageAdmin: PageAdminService;
  blockAdmin: BlockAdminService;
  contentAdmin: ContentAdminService;
  seoAdmin: SeoAdminService;
  publishService: PublishService;
  previewService: PreviewService;
}

interface ApiEnv {
  Variables: {
    tenantId: string;
    actorId: string;
    deps: StorefrontApiDeps;
  };
}

// ─── Helpers ───

function success(data: unknown, meta?: Record<string, unknown>) {
  return { success: true as const, data, meta };
}

function error(code: string, message: string, status: number) {
  return new Response(
    JSON.stringify({ success: false, error: { code, message } }),
    { status, headers: { "Content-Type": "application/json" } },
  );
}

function parseBody<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw { status: 400, code: "VALIDATION_ERROR", message: result.error.message };
  }
  return result.data;
}

// ─── API Factory ───

export function createStorefrontApi(deps: StorefrontApiDeps): Hono<ApiEnv> {
  const api = new Hono<ApiEnv>();

  // ── Middleware: inject deps and extract tenant context ──
  api.use("*", async (c, next) => {
    c.set("deps", deps);
    const tenantId = c.req.header("X-Tenant-ID") ?? "";
    const actorId = c.req.header("X-Actor-ID") ?? "system";
    c.set("tenantId", tenantId);
    c.set("actorId", actorId);
    await next();
  });

  // ── Security headers ──
  api.use("*", async (c, next) => {
    await next();
    c.header("X-Content-Type-Options", "nosniff");
    c.header("X-Frame-Options", "DENY");
    c.header("X-XSS-Protection", "0");
    c.header("Referrer-Policy", "strict-origin-when-cross-origin");
    c.header(
      "Content-Security-Policy",
      "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'",
    );
  });

  // ══════════════════════════════════════
  // ADMIN API ROUTES
  // ══════════════════════════════════════

  // ── Storefronts ──

  api.get("/admin/storefronts", async (c) => {
    const { deps, tenantId } = getCtx(c);
    const list = await deps.storefrontAdmin.listStorefronts(tenantId);
    return c.json(success(list));
  });

  api.post("/admin/storefronts", async (c) => {
    const { deps, tenantId } = getCtx(c);
    const body = parseBody(createStorefrontSchema, await c.req.json());
    const sf = await deps.storefrontAdmin.createStorefront({ ...body, tenantId });
    return c.json(success(sf), 201);
  });

  api.get("/admin/storefronts/:storefrontId", async (c) => {
    const { deps } = getCtx(c);
    const sf = await deps.storefrontAdmin.getStorefront(c.req.param("storefrontId"));
    if (!sf) return error("NOT_FOUND", "Storefront not found", 404);
    return c.json(success(sf));
  });

  api.patch("/admin/storefronts/:storefrontId", async (c) => {
    const { deps } = getCtx(c);
    const body = parseBody(updateStorefrontSchema, await c.req.json());
    const sf = await deps.storefrontAdmin.updateStorefront(c.req.param("storefrontId"), body);
    return c.json(success(sf));
  });

  api.delete("/admin/storefronts/:storefrontId", async (c) => {
    const { deps } = getCtx(c);
    await deps.storefrontAdmin.deleteStorefront(c.req.param("storefrontId"));
    return c.body(null, 204);
  });

  // ── Domain Mappings ──

  api.get("/admin/storefronts/:storefrontId/domains", async (c) => {
    const { deps } = getCtx(c);
    const list = await deps.storefrontAdmin.listDomainMappings(c.req.param("storefrontId"));
    return c.json(success(list));
  });

  api.post("/admin/storefronts/:storefrontId/domains", async (c) => {
    const { deps } = getCtx(c);
    const body = parseBody(createDomainMappingSchema, await c.req.json());
    const dm = await deps.storefrontAdmin.addDomainMapping(body);
    return c.json(success(dm), 201);
  });

  api.delete("/admin/storefronts/:storefrontId/domains/:domainId", async (c) => {
    const { deps } = getCtx(c);
    await deps.storefrontAdmin.removeDomainMapping(c.req.param("domainId"));
    return c.body(null, 204);
  });

  // ── Themes ──

  api.get("/admin/storefronts/:storefrontId/themes", async (c) => {
    const { deps } = getCtx(c);
    const list = await deps.themeAdmin.listThemes(c.req.param("storefrontId"));
    return c.json(success(list));
  });

  api.post("/admin/storefronts/:storefrontId/themes", async (c) => {
    const { deps } = getCtx(c);
    const body = parseBody(createThemeSchema, await c.req.json());
    const theme = await deps.themeAdmin.createTheme(body);
    return c.json(success(theme), 201);
  });

  api.get("/admin/storefronts/:storefrontId/themes/:themeId", async (c) => {
    const { deps } = getCtx(c);
    const theme = await deps.themeAdmin.getTheme(c.req.param("themeId"));
    if (!theme) return error("NOT_FOUND", "Theme not found", 404);
    return c.json(success(theme));
  });

  // ── Theme Versions ──

  api.get("/admin/storefronts/:storefrontId/themes/:themeId/versions", async (c) => {
    const { deps } = getCtx(c);
    const list = await deps.themeAdmin.listVersions(c.req.param("themeId"));
    return c.json(success(list));
  });

  api.post("/admin/storefronts/:storefrontId/themes/:themeId/versions", async (c) => {
    const { deps, actorId } = getCtx(c);
    const body = parseBody(createThemeVersionSchema, await c.req.json());
    const version = await deps.themeAdmin.createVersion({
      ...body,
      createdBy: actorId,
    });
    return c.json(success(version), 201);
  });

  api.get("/admin/storefronts/:storefrontId/themes/:themeId/versions/:versionId", async (c) => {
    const { deps } = getCtx(c);
    const version = await deps.themeAdmin.getVersion(c.req.param("versionId"));
    if (!version) return error("NOT_FOUND", "Theme version not found", 404);
    return c.json(success(version));
  });

  // ── Theme Token Sets ──

  api.post("/admin/storefronts/:storefrontId/themes/:themeId/versions/:versionId/token-sets", async (c) => {
    const { deps } = getCtx(c);
    const body = parseBody(createThemeTokenSetSchema, await c.req.json());
    const tokenSet = await deps.themeAdmin.setTokens(body);
    return c.json(success(tokenSet), 201);
  });

  // ── Theme Lint & CSS ──

  api.get("/admin/storefronts/:storefrontId/themes/:themeId/versions/:versionId/lint", async (c) => {
    const { deps } = getCtx(c);
    const result = await deps.themeAdmin.lintTheme(c.req.param("versionId"));
    return c.json(success(result));
  });

  api.get("/admin/storefronts/:storefrontId/themes/:themeId/versions/:versionId/css", async (c) => {
    const { deps } = getCtx(c);
    const result = await deps.themeAdmin.compileThemeCss(c.req.param("versionId"));
    return c.json(success(result));
  });

  // ── Layouts ──

  api.get("/admin/storefronts/:storefrontId/layouts", async (c) => {
    const { deps } = getCtx(c);
    const list = await deps.layoutAdmin.listTemplates(c.req.param("storefrontId"));
    return c.json(success(list));
  });

  api.post("/admin/storefronts/:storefrontId/layouts", async (c) => {
    const { deps } = getCtx(c);
    const body = parseBody(createLayoutTemplateSchema, await c.req.json());
    const template = await deps.layoutAdmin.createTemplate(body);
    return c.json(success(template), 201);
  });

  api.get("/admin/storefronts/:storefrontId/layouts/:layoutId", async (c) => {
    const { deps } = getCtx(c);
    const template = await deps.layoutAdmin.getTemplate(c.req.param("layoutId"));
    if (!template) return error("NOT_FOUND", "Layout not found", 404);
    return c.json(success(template));
  });

  // ── Layout Versions ──

  api.post("/admin/storefronts/:storefrontId/layouts/:layoutId/versions", async (c) => {
    const { deps, actorId } = getCtx(c);
    const body = parseBody(createLayoutVersionSchema, await c.req.json());
    const version = await deps.layoutAdmin.createVersion({
      ...body,
      createdBy: actorId,
    });
    return c.json(success(version), 201);
  });

  api.get("/admin/storefronts/:storefrontId/layouts/:layoutId/versions/:versionId", async (c) => {
    const { deps } = getCtx(c);
    const version = await deps.layoutAdmin.getVersion(c.req.param("versionId"));
    if (!version) return error("NOT_FOUND", "Layout version not found", 404);
    const slots = await deps.layoutAdmin.getSlots(version.id);
    return c.json(success({ ...version, slots }));
  });

  // ── Pages ──

  api.get("/admin/storefronts/:storefrontId/pages", async (c) => {
    const { deps } = getCtx(c);
    const list = await deps.pageAdmin.listPages(c.req.param("storefrontId"));
    return c.json(success(list));
  });

  api.post("/admin/storefronts/:storefrontId/pages", async (c) => {
    const { deps } = getCtx(c);
    const body = parseBody(createPageDefinitionSchema, await c.req.json());
    const page = await deps.pageAdmin.createPage(body);
    return c.json(success(page), 201);
  });

  api.get("/admin/storefronts/:storefrontId/pages/:pageId", async (c) => {
    const { deps } = getCtx(c);
    const page = await deps.pageAdmin.getPage(c.req.param("pageId"));
    if (!page) return error("NOT_FOUND", "Page not found", 404);
    return c.json(success(page));
  });

  // ── Page Versions ──

  api.post("/admin/storefronts/:storefrontId/pages/:pageId/versions", async (c) => {
    const { deps, actorId } = getCtx(c);
    const body = parseBody(createPageVersionSchema, await c.req.json());
    const version = await deps.pageAdmin.createVersion({
      ...body,
      createdBy: actorId,
    });
    return c.json(success(version), 201);
  });

  api.get("/admin/storefronts/:storefrontId/pages/:pageId/versions/:versionId", async (c) => {
    const { deps } = getCtx(c);
    const version = await deps.pageAdmin.getVersion(c.req.param("versionId"));
    if (!version) return error("NOT_FOUND", "Page version not found", 404);
    const blocks = await deps.pageAdmin.getBlocks(version.id);
    return c.json(success({ ...version, blocks }));
  });

  // ── Page Routes ──

  api.get("/admin/storefronts/:storefrontId/routes", async (c) => {
    const { deps } = getCtx(c);
    const routes = await deps.pageAdmin.getRoutes(c.req.param("storefrontId"));
    return c.json(success(routes));
  });

  api.post("/admin/storefronts/:storefrontId/routes", async (c) => {
    const { deps } = getCtx(c);
    const body = parseBody(pageRouteSchema, await c.req.json());
    const route = await deps.pageAdmin.addRoute(body);
    return c.json(success(route), 201);
  });

  // ── Blocks ──

  api.get("/admin/blocks", async (c) => {
    const { deps } = getCtx(c);
    const list = await deps.blockAdmin.listBlockDefinitions();
    return c.json(success(list));
  });

  api.post("/admin/blocks", async (c) => {
    const { deps } = getCtx(c);
    const body = parseBody(createBlockDefinitionSchema, await c.req.json());
    const block = await deps.blockAdmin.createBlockDefinition(body);
    return c.json(success(block), 201);
  });

  api.get("/admin/blocks/:blockId", async (c) => {
    const { deps } = getCtx(c);
    const block = await deps.blockAdmin.getBlockDefinition(c.req.param("blockId"));
    if (!block) return error("NOT_FOUND", "Block not found", 404);
    return c.json(success(block));
  });

  // ── Block Versions ──

  api.get("/admin/blocks/:blockId/versions", async (c) => {
    const { deps } = getCtx(c);
    const list = await deps.blockAdmin.listBlockVersions(c.req.param("blockId"));
    return c.json(success(list));
  });

  api.post("/admin/blocks/:blockId/versions", async (c) => {
    const { deps } = getCtx(c);
    const body = parseBody(createBlockVersionSchema, await c.req.json());
    const version = await deps.blockAdmin.createBlockVersion(body);
    return c.json(success(version), 201);
  });

  // ── Content Entries ──

  api.get("/admin/storefronts/:storefrontId/content", async (c) => {
    const { deps } = getCtx(c);
    const list = await deps.contentAdmin.listContentEntries(c.req.param("storefrontId"));
    return c.json(success(list));
  });

  api.post("/admin/storefronts/:storefrontId/content", async (c) => {
    const { deps } = getCtx(c);
    const body = parseBody(createContentEntrySchema, await c.req.json());
    const entry = await deps.contentAdmin.createContentEntry(body);
    return c.json(success(entry), 201);
  });

  api.get("/admin/storefronts/:storefrontId/content/:contentId", async (c) => {
    const { deps } = getCtx(c);
    const entry = await deps.contentAdmin.getContentEntry(c.req.param("contentId"));
    if (!entry) return error("NOT_FOUND", "Content entry not found", 404);
    return c.json(success(entry));
  });

  api.patch("/admin/storefronts/:storefrontId/content/:contentId", async (c) => {
    const { deps } = getCtx(c);
    const body = parseBody(updateContentEntrySchema, await c.req.json());
    const entry = await deps.contentAdmin.updateContentEntry(c.req.param("contentId"), body);
    return c.json(success(entry));
  });

  // ── Navigation Menus ──

  api.get("/admin/storefronts/:storefrontId/navigation", async (c) => {
    const { deps } = getCtx(c);
    const list = await deps.contentAdmin.listNavigationMenus(c.req.param("storefrontId"));
    return c.json(success(list));
  });

  api.post("/admin/storefronts/:storefrontId/navigation", async (c) => {
    const { deps } = getCtx(c);
    const body = parseBody(createNavigationMenuSchema, await c.req.json());
    const menu = await deps.contentAdmin.createNavigationMenu(body);
    return c.json(success(menu), 201);
  });

  // ── SEO Profiles ──

  api.get("/admin/storefronts/:storefrontId/seo", async (c) => {
    const { deps } = getCtx(c);
    const list = await deps.seoAdmin.listSeoProfiles(c.req.param("storefrontId"));
    return c.json(success(list));
  });

  api.post("/admin/storefronts/:storefrontId/seo", async (c) => {
    const { deps } = getCtx(c);
    const body = parseBody(createSeoProfileSchema, await c.req.json());
    const profile = await deps.seoAdmin.createSeoProfile(body);
    return c.json(success(profile), 201);
  });

  // ── Redirects ──

  api.get("/admin/storefronts/:storefrontId/redirects", async (c) => {
    const { deps } = getCtx(c);
    const list = await deps.seoAdmin.listRedirects(c.req.param("storefrontId"));
    return c.json(success(list));
  });

  api.post("/admin/storefronts/:storefrontId/redirects", async (c) => {
    const { deps } = getCtx(c);
    const body = parseBody(createRedirectRuleSchema, await c.req.json());
    const rule = await deps.seoAdmin.createRedirect(body);
    return c.json(success(rule), 201);
  });

  // ── Preview ──

  api.post("/admin/storefronts/:storefrontId/preview", async (c) => {
    const { deps, actorId } = getCtx(c);
    const body = parseBody(createPreviewSessionSchema, await c.req.json());
    const { session, token } = await deps.previewService.createSession({
      ...body,
      actorId,
    });
    return c.json(success({ ...session, token }), 201);
  });

  api.delete("/admin/storefronts/:storefrontId/preview/:sessionId", async (c) => {
    const { deps } = getCtx(c);
    await deps.previewService.revokeSession(c.req.param("sessionId"));
    return c.body(null, 204);
  });

  // ── Publish ──

  api.get("/admin/storefronts/:storefrontId/publish-jobs", async (c) => {
    const { deps } = getCtx(c);
    const list = await deps.publishService.listJobs(c.req.param("storefrontId"));
    return c.json(success(list));
  });

  api.post("/admin/storefronts/:storefrontId/publish", async (c) => {
    const { deps, actorId } = getCtx(c);
    const body = parseBody(createPublishJobSchema, await c.req.json());
    const job = await deps.publishService.requestPublish({
      ...body,
      createdBy: actorId,
      currentState: "draft",
    });
    return c.json(success(job), 201);
  });

  // ══════════════════════════════════════
  // OPENAPI / SWAGGER
  // ══════════════════════════════════════

  api.get("/docs", swaggerUI({ url: "/openapi.json" }));

  api.get("/openapi.json", (c) => {
    return c.json(generateOpenApiSpec());
  });

  // ══════════════════════════════════════
  // ERROR HANDLER
  // ══════════════════════════════════════

  api.onError((err, c) => {
    if (typeof err === "object" && err !== null && "status" in err) {
      const e = err as unknown as { status: number; code?: string; message?: string };
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: e.code ?? "REQUEST_ERROR",
            message: e.message ?? "Request failed",
          },
        }),
        {
          status: e.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    globalThis.console.error("Unhandled error:", err);
    return c.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      500,
    );
  });

  return api;
}

// ─── Context Helper ───

function getCtx(c: { get: (key: string) => unknown }) {
  return {
    deps: c.get("deps") as StorefrontApiDeps,
    tenantId: c.get("tenantId") as string,
    actorId: c.get("actorId") as string,
  };
}

// ─── OpenAPI Spec ───

function generateOpenApiSpec() {
  return {
    openapi: "3.1.0",
    info: {
      title: "Africa Sokoni Storefront Management API",
      description: "Multi-tenant storefront configuration, theming, and content management API for africasokoni.co.ke storefronts.",
      version: "1.0.0",
      contact: { name: "Africa Sokoni Platform" },
    },
    servers: [{ url: "/api/v1", description: "API base" }],
    security: [{ tenantHeader: [] }],
    components: {
      securitySchemes: {
        tenantHeader: {
          type: "apiKey",
          in: "header",
          name: "X-Tenant-ID",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
      schemas: {
        SuccessEnvelope: {
          type: "object",
          properties: {
            success: { type: "boolean", enum: [true] },
            data: {},
            meta: {
              type: "object",
              properties: {
                page: { type: "integer" },
                perPage: { type: "integer" },
                total: { type: "integer" },
                totalPages: { type: "integer" },
              },
            },
          },
        },
        ErrorEnvelope: {
          type: "object",
          properties: {
            success: { type: "boolean", enum: [false] },
            error: {
              type: "object",
              properties: {
                code: { type: "string" },
                message: { type: "string" },
                details: { type: "array", items: { type: "object" } },
              },
            },
          },
        },
        Storefront: {
          type: "object",
          properties: {
            id: { type: "string" },
            tenantId: { type: "string" },
            code: { type: "string" },
            name: { type: "string" },
            status: { type: "string", enum: ["active", "inactive", "maintenance", "suspended"] },
            defaultLocale: { type: "string" },
            supportedLocales: { type: "array", items: { type: "string" } },
            primaryDomain: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Theme: {
          type: "object",
          properties: {
            id: { type: "string" },
            storefrontId: { type: "string" },
            code: { type: "string" },
            name: { type: "string" },
            status: { type: "string" },
          },
        },
        ThemeVersion: {
          type: "object",
          properties: {
            id: { type: "string" },
            themeId: { type: "string" },
            version: { type: "string" },
            state: { type: "string", enum: ["draft", "published", "archived", "superseded"] },
            description: { type: "string" },
          },
        },
        ThemeLintResult: {
          type: "object",
          properties: {
            valid: { type: "boolean" },
            missingTokens: { type: "array", items: { type: "string" } },
            contrastFailures: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  foreground: { type: "string" },
                  background: { type: "string" },
                  ratio: { type: "number" },
                  passesAA: { type: "boolean" },
                },
              },
            },
            warnings: { type: "array", items: { type: "string" } },
          },
        },
        Layout: {
          type: "object",
          properties: {
            id: { type: "string" },
            storefrontId: { type: "string" },
            code: { type: "string" },
            name: { type: "string" },
            pageType: { type: "string" },
          },
        },
        Page: {
          type: "object",
          properties: {
            id: { type: "string" },
            storefrontId: { type: "string" },
            code: { type: "string" },
            pageType: { type: "string" },
            name: { type: "string" },
          },
        },
        Block: {
          type: "object",
          properties: {
            id: { type: "string" },
            code: { type: "string" },
            category: { type: "string" },
            displayName: { type: "string" },
            status: { type: "string" },
          },
        },
        ContentEntry: {
          type: "object",
          properties: {
            id: { type: "string" },
            contentType: { type: "string" },
            code: { type: "string" },
            locale: { type: "string" },
            state: { type: "string" },
            data: { type: "object" },
          },
        },
        NavigationMenu: {
          type: "object",
          properties: {
            id: { type: "string" },
            code: { type: "string" },
            name: { type: "string" },
            locale: { type: "string" },
            state: { type: "string" },
          },
        },
        SeoProfile: {
          type: "object",
          properties: {
            id: { type: "string" },
            code: { type: "string" },
            titleTemplate: { type: "string" },
            robots: { type: "string" },
          },
        },
        RedirectRule: {
          type: "object",
          properties: {
            id: { type: "string" },
            sourcePath: { type: "string" },
            destinationPath: { type: "string" },
            httpStatus: { type: "string" },
            active: { type: "boolean" },
          },
        },
        PreviewSession: {
          type: "object",
          properties: {
            id: { type: "string" },
            token: { type: "string" },
            expiresAt: { type: "string", format: "date-time" },
          },
        },
        PublishJob: {
          type: "object",
          properties: {
            id: { type: "string" },
            targetType: { type: "string" },
            targetId: { type: "string" },
            status: { type: "string", enum: ["pending", "validating", "publishing", "completed", "failed"] },
          },
        },
      },
    },
    paths: {
      "/admin/storefronts": {
        get: {
          tags: ["Storefronts"],
          summary: "List storefronts",
          operationId: "listStorefronts",
          responses: { "200": { description: "List of storefronts" } },
        },
        post: {
          tags: ["Storefronts"],
          summary: "Create storefront",
          operationId: "createStorefront",
          requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Storefront" } } } },
          responses: { "201": { description: "Storefront created" } },
        },
      },
      "/admin/storefronts/{storefrontId}": {
        get: { tags: ["Storefronts"], summary: "Get storefront", operationId: "getStorefront", responses: { "200": { description: "Storefront details" } } },
        patch: { tags: ["Storefronts"], summary: "Update storefront", operationId: "updateStorefront", responses: { "200": { description: "Storefront updated" } } },
        delete: { tags: ["Storefronts"], summary: "Delete storefront", operationId: "deleteStorefront", responses: { "204": { description: "Storefront deleted" } } },
      },
      "/admin/storefronts/{storefrontId}/domains": {
        get: { tags: ["Domains"], summary: "List domain mappings", operationId: "listDomains", responses: { "200": { description: "Domain mappings" } } },
        post: { tags: ["Domains"], summary: "Add domain mapping", operationId: "addDomain", responses: { "201": { description: "Domain added" } } },
      },
      "/admin/storefronts/{storefrontId}/themes": {
        get: { tags: ["Themes"], summary: "List themes", operationId: "listThemes", responses: { "200": { description: "Themes" } } },
        post: { tags: ["Themes"], summary: "Create theme", operationId: "createTheme", responses: { "201": { description: "Theme created" } } },
      },
      "/admin/storefronts/{storefrontId}/themes/{themeId}/versions": {
        get: { tags: ["Themes"], summary: "List theme versions", operationId: "listThemeVersions", responses: { "200": { description: "Theme versions" } } },
        post: { tags: ["Themes"], summary: "Create theme version", operationId: "createThemeVersion", responses: { "201": { description: "Version created" } } },
      },
      "/admin/storefronts/{storefrontId}/themes/{themeId}/versions/{versionId}/lint": {
        get: { tags: ["Themes"], summary: "Lint theme", operationId: "lintTheme", responses: { "200": { description: "Lint result" } } },
      },
      "/admin/storefronts/{storefrontId}/themes/{themeId}/versions/{versionId}/css": {
        get: { tags: ["Themes"], summary: "Compile theme CSS", operationId: "compileThemeCss", responses: { "200": { description: "Compiled CSS" } } },
      },
      "/admin/storefronts/{storefrontId}/layouts": {
        get: { tags: ["Layouts"], summary: "List layouts", operationId: "listLayouts", responses: { "200": { description: "Layouts" } } },
        post: { tags: ["Layouts"], summary: "Create layout", operationId: "createLayout", responses: { "201": { description: "Layout created" } } },
      },
      "/admin/storefronts/{storefrontId}/pages": {
        get: { tags: ["Pages"], summary: "List pages", operationId: "listPages", responses: { "200": { description: "Pages" } } },
        post: { tags: ["Pages"], summary: "Create page", operationId: "createPage", responses: { "201": { description: "Page created" } } },
      },
      "/admin/storefronts/{storefrontId}/routes": {
        get: { tags: ["Routes"], summary: "List routes", operationId: "listRoutes", responses: { "200": { description: "Routes" } } },
        post: { tags: ["Routes"], summary: "Create route", operationId: "createRoute", responses: { "201": { description: "Route created" } } },
      },
      "/admin/blocks": {
        get: { tags: ["Blocks"], summary: "List block definitions", operationId: "listBlocks", responses: { "200": { description: "Blocks" } } },
        post: { tags: ["Blocks"], summary: "Create block definition", operationId: "createBlock", responses: { "201": { description: "Block created" } } },
      },
      "/admin/blocks/{blockId}/versions": {
        get: { tags: ["Blocks"], summary: "List block versions", operationId: "listBlockVersions", responses: { "200": { description: "Block versions" } } },
        post: { tags: ["Blocks"], summary: "Create block version", operationId: "createBlockVersion", responses: { "201": { description: "Version created" } } },
      },
      "/admin/storefronts/{storefrontId}/content": {
        get: { tags: ["Content"], summary: "List content entries", operationId: "listContent", responses: { "200": { description: "Content entries" } } },
        post: { tags: ["Content"], summary: "Create content entry", operationId: "createContent", responses: { "201": { description: "Entry created" } } },
      },
      "/admin/storefronts/{storefrontId}/navigation": {
        get: { tags: ["Navigation"], summary: "List navigation menus", operationId: "listNavigation", responses: { "200": { description: "Menus" } } },
        post: { tags: ["Navigation"], summary: "Create navigation menu", operationId: "createNavigation", responses: { "201": { description: "Menu created" } } },
      },
      "/admin/storefronts/{storefrontId}/seo": {
        get: { tags: ["SEO"], summary: "List SEO profiles", operationId: "listSeoProfiles", responses: { "200": { description: "SEO profiles" } } },
        post: { tags: ["SEO"], summary: "Create SEO profile", operationId: "createSeoProfile", responses: { "201": { description: "Profile created" } } },
      },
      "/admin/storefronts/{storefrontId}/redirects": {
        get: { tags: ["SEO"], summary: "List redirects", operationId: "listRedirects", responses: { "200": { description: "Redirects" } } },
        post: { tags: ["SEO"], summary: "Create redirect", operationId: "createRedirect", responses: { "201": { description: "Redirect created" } } },
      },
      "/admin/storefronts/{storefrontId}/preview": {
        post: { tags: ["Preview"], summary: "Create preview session", operationId: "createPreview", responses: { "201": { description: "Session created" } } },
      },
      "/admin/storefronts/{storefrontId}/publish": {
        post: { tags: ["Publish"], summary: "Request publish", operationId: "requestPublish", responses: { "201": { description: "Job created" } } },
      },
      "/admin/storefronts/{storefrontId}/publish-jobs": {
        get: { tags: ["Publish"], summary: "List publish jobs", operationId: "listPublishJobs", responses: { "200": { description: "Jobs" } } },
      },
    },
    tags: [
      { name: "Storefronts", description: "Storefront lifecycle management" },
      { name: "Domains", description: "Custom domain mappings" },
      { name: "Themes", description: "Theme management, token sets, CSS compilation, WCAG validation" },
      { name: "Layouts", description: "Layout templates and slot definitions" },
      { name: "Pages", description: "Page definitions, versions, and block composition" },
      { name: "Routes", description: "URL routing configuration" },
      { name: "Blocks", description: "Block definitions and versioned configurations" },
      { name: "Content", description: "Content entries with localization and scheduling" },
      { name: "Navigation", description: "Navigation menus with nested items" },
      { name: "SEO", description: "SEO profiles, redirects, meta configuration" },
      { name: "Preview", description: "Preview sessions with secure tokens" },
      { name: "Publish", description: "Publish workflow and validation jobs" },
    ],
  };
}
