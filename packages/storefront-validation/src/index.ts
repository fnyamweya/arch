import { z } from "zod";

// ─── Reusable Primitives ───

export const tenantIdSchema = z
  .string()
  .min(3)
  .max(63)
  .regex(/^[a-z][a-z0-9-]*[a-z0-9]$/, "Tenant ID must be lowercase alphanumeric with hyphens");

export const storefrontIdSchema = z
  .string()
  .regex(/^sf_[a-zA-Z0-9]{20,}$/, "Storefront ID must start with sf_ prefix");

export const themeIdSchema = z
  .string()
  .regex(/^thm_[a-zA-Z0-9]{20,}$/, "Theme ID must start with thm_ prefix");

export const themeVersionIdSchema = z
  .string()
  .regex(/^tv_[a-zA-Z0-9]{20,}$/, "Theme version ID must start with tv_ prefix");

export const layoutIdSchema = z
  .string()
  .regex(/^lay_[a-zA-Z0-9]{20,}$/, "Layout ID must start with lay_ prefix");

export const layoutVersionIdSchema = z
  .string()
  .regex(/^lv_[a-zA-Z0-9]{20,}$/, "Layout version ID must start with lv_ prefix");

export const pageIdSchema = z
  .string()
  .regex(/^pg_[a-zA-Z0-9]{20,}$/, "Page ID must start with pg_ prefix");

export const blockCodeSchema = z
  .string()
  .min(3)
  .max(64)
  .regex(/^[a-z][a-z0-9-]*[a-z0-9]$/, "Block code must be lowercase alphanumeric with hyphens");

export const slugSchema = z
  .string()
  .min(1)
  .max(256)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens");

export const localeCodeSchema = z
  .string()
  .regex(/^[a-z]{2}(?:-[A-Z]{2})?$/, "Locale must be a valid BCP 47 tag (e.g. en, en-US)");

export const semanticVersionSchema = z
  .string()
  .regex(/^\d+\.\d+\.\d+$/, "Version must follow semver (e.g. 1.0.0)");

export const routePathSchema = z
  .string()
  .min(1)
  .max(2048)
  .regex(/^\//, "Route path must start with /");

export const domainNameSchema = z
  .string()
  .min(1)
  .max(253)
  .regex(
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
    "Must be a valid domain name",
  );

export const tokenNameSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[a-z][a-z0-9./-]*$/, "Token name must follow design token naming convention");

export const cachePolicySchema = z.object({
  maxAge: z.number().int().min(0).max(31536000),
  staleWhileRevalidate: z.number().int().min(0).max(86400),
  tags: z.array(z.string().max(128)).max(20),
});

export const seoMetaSchema = z.object({
  title: z.string().max(120).optional(),
  description: z.string().max(320).optional(),
  keywords: z.array(z.string().max(64)).max(20).optional(),
  robots: z.string().max(128).optional(),
  canonicalUrl: z.string().url().max(2048).optional(),
  ogTitle: z.string().max(120).optional(),
  ogDescription: z.string().max(320).optional(),
  ogImage: z.string().url().max(2048).optional(),
  twitterCard: z.enum(["summary", "summary_large_image", "app", "player"]).optional(),
  structuredData: z.record(z.string(), z.unknown()).optional(),
});

export const visibilityRulesSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  audiences: z.array(z.string().max(64)).max(20).optional(),
  devices: z.array(z.enum(["mobile", "tablet", "desktop"])).optional(),
  geoRegions: z.array(z.string().max(8)).max(50).optional(),
});

// ─── Enums ───

export const storefrontStatusSchema = z.enum(["active", "inactive", "maintenance", "suspended"]);
export const publishStateSchema = z.enum(["draft", "published", "archived", "superseded"]);
export const pageTypeSchema = z.enum([
  "home",
  "collection-list",
  "collection-detail",
  "product-detail",
  "search",
  "cart",
  "account",
  "custom",
  "campaign-landing",
  "legal-content",
]);
export const routeTypeSchema = z.enum(["static", "dynamic", "pattern", "catch-all"]);
export const routeStatusSchema = z.enum(["active", "inactive", "redirected"]);
export const tokenGroupSchema = z.enum([
  "color",
  "font",
  "spacing",
  "sizing",
  "radius",
  "shadow",
  "opacity",
  "motion",
  "z-index",
  "breakpoint",
  "border",
]);
export const tokenTypeSchema = z.enum([
  "color",
  "dimension",
  "fontFamily",
  "fontWeight",
  "fontSize",
  "lineHeight",
  "letterSpacing",
  "duration",
  "cubicBezier",
  "number",
  "shadow",
  "gradient",
  "string",
  "boolean",
  "composite",
]);
export const themeModeSchema = z.enum(["default", "dark", "high-contrast", "campaign"]);
export const tokenSetStatusSchema = z.enum(["active", "inactive"]);
export const blockCategorySchema = z.enum([
  "hero",
  "navigation",
  "product-grid",
  "product-card",
  "product-gallery",
  "product-info",
  "product-reviews",
  "product-recommendations",
  "collection-grid",
  "collection-filter",
  "cart-summary",
  "cart-items",
  "account-info",
  "search-bar",
  "search-results",
  "content-text",
  "content-image",
  "content-video",
  "content-banner",
  "footer",
  "spacer",
]);
export const blockStatusSchema = z.enum(["active", "inactive", "deprecated"]);
export const hydrationStrategySchema = z.enum(["server-only", "client-only", "progressive", "island"]);
export const deprecationStatusSchema = z.enum(["none", "soft", "hard"]);
export const sslStatusSchema = z.enum(["pending", "active", "expired", "failed"]);
export const verificationStatusSchema = z.enum(["pending", "verified", "failed"]);
export const redirectBehaviorSchema = z.enum(["none", "permanent", "temporary"]);
export const navigationItemTypeSchema = z.enum(["link", "page-ref", "external", "divider", "heading"]);
export const sectionStatusSchema = z.enum(["active", "inactive"]);
export const contentEntryStateSchema = z.enum(["draft", "published", "archived"]);
export const redirectHttpStatusSchema = z.enum(["301", "302", "307", "308"]);
export const previewScopeTypeSchema = z.enum(["theme", "layout", "page", "block", "storefront"]);
export const publishTargetTypeSchema = z.enum(["theme", "layout", "page", "block", "navigation", "content"]);
export const publishJobStatusSchema = z.enum(["pending", "validating", "publishing", "completed", "failed"]);

// ─── Storefront ───

export const createStorefrontSchema = z.object({
  tenantId: tenantIdSchema,
  code: slugSchema,
  name: z.string().min(1).max(256),
  defaultLocale: localeCodeSchema,
  supportedLocales: z.array(localeCodeSchema).min(1).max(50),
  seoDefaults: seoMetaSchema.optional(),
  featureFlags: z.record(z.string(), z.boolean()).optional(),
});

export const updateStorefrontSchema = z.object({
  name: z.string().min(1).max(256).optional(),
  status: storefrontStatusSchema.optional(),
  defaultLocale: localeCodeSchema.optional(),
  supportedLocales: z.array(localeCodeSchema).min(1).max(50).optional(),
  seoDefaults: seoMetaSchema.optional(),
  featureFlags: z.record(z.string(), z.boolean()).optional(),
});

// ─── Domain Mapping ───

export const createDomainMappingSchema = z.object({
  storefrontId: storefrontIdSchema,
  hostname: domainNameSchema,
  isPrimary: z.boolean().optional(),
  redirectBehavior: redirectBehaviorSchema.optional(),
});

export const updateDomainMappingSchema = z.object({
  isPrimary: z.boolean().optional(),
  redirectBehavior: redirectBehaviorSchema.optional(),
});

// ─── Theme ───

export const createThemeSchema = z.object({
  storefrontId: storefrontIdSchema,
  code: slugSchema,
  name: z.string().min(1).max(256),
});

export const updateThemeSchema = z.object({
  name: z.string().min(1).max(256).optional(),
  status: storefrontStatusSchema.optional(),
});

export const createThemeVersionSchema = z.object({
  themeId: themeIdSchema,
  version: semanticVersionSchema,
  baseThemeRef: z.string().max(256).nullable().optional(),
  description: z.string().max(2048).optional(),
});

export const themeTokenSchema = z.object({
  group: tokenGroupSchema,
  name: tokenNameSchema,
  value: z.string().min(1).max(1024),
  type: tokenTypeSchema,
  reference: z.string().max(256).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createThemeTokenSetSchema = z.object({
  themeVersionId: themeVersionIdSchema,
  mode: themeModeSchema,
  tokens: z.array(themeTokenSchema).min(1).max(2000),
});

export const updateThemeTokenSetSchema = z.object({
  tokens: z.array(themeTokenSchema).min(1).max(2000),
  status: tokenSetStatusSchema.optional(),
});

// ─── Layout ───

export const createLayoutTemplateSchema = z.object({
  storefrontId: storefrontIdSchema,
  code: slugSchema,
  name: z.string().min(1).max(256),
  pageType: pageTypeSchema,
  description: z.string().max(2048).optional(),
});

export const updateLayoutTemplateSchema = z.object({
  name: z.string().min(1).max(256).optional(),
  description: z.string().max(2048).optional(),
});

export const layoutSlotSchema = z.object({
  slotKey: z.string().min(1).max(64).regex(/^[a-z][a-zA-Z0-9]*$/, "Slot key must be camelCase"),
  displayName: z.string().min(1).max(128),
  allowedBlockCategories: z.array(blockCategorySchema).min(1),
  minBlocks: z.number().int().min(0).max(50),
  maxBlocks: z.number().int().min(1).max(50),
  required: z.boolean().optional(),
  responsiveRules: z.record(z.string(), z.unknown()).optional(),
  orderingRules: z.record(z.string(), z.unknown()).optional(),
});

export const createLayoutVersionSchema = z.object({
  layoutTemplateId: layoutIdSchema,
  version: semanticVersionSchema,
  schema: z.record(z.string(), z.unknown()).optional(),
  slots: z.array(layoutSlotSchema).min(1).max(30),
});

// ─── Page ───

export const createPageDefinitionSchema = z.object({
  storefrontId: storefrontIdSchema,
  code: slugSchema,
  pageType: pageTypeSchema,
  name: z.string().min(1).max(256),
  seoProfileId: z.string().max(128).nullable().optional(),
});

export const updatePageDefinitionSchema = z.object({
  name: z.string().min(1).max(256).optional(),
  seoProfileId: z.string().max(128).nullable().optional(),
});

export const createPageVersionSchema = z.object({
  pageDefinitionId: pageIdSchema,
  layoutVersionId: layoutVersionIdSchema,
  version: semanticVersionSchema,
  locale: localeCodeSchema,
  title: z.string().min(1).max(256),
  description: z.string().max(2048).optional(),
  contentSchemaVersion: semanticVersionSchema.optional(),
});

export const pageRouteSchema = z.object({
  storefrontId: storefrontIdSchema,
  pageDefinitionId: pageIdSchema,
  routeType: routeTypeSchema,
  pathPattern: routePathSchema,
  locale: localeCodeSchema,
  canonicalRoute: z.boolean().optional(),
});

// ─── Block ───

export const createBlockDefinitionSchema = z.object({
  code: blockCodeSchema,
  category: blockCategorySchema,
  displayName: z.string().min(1).max(256),
  description: z.string().max(2048).optional(),
  icon: z.string().max(64).optional(),
});

export const updateBlockDefinitionSchema = z.object({
  displayName: z.string().min(1).max(256).optional(),
  description: z.string().max(2048).optional(),
  icon: z.string().max(64).optional(),
  status: blockStatusSchema.optional(),
});

export const createBlockVersionSchema = z.object({
  blockDefinitionId: z.string().min(1),
  version: semanticVersionSchema,
  configSchema: z.record(z.string(), z.unknown()),
  contentSchema: z.record(z.string(), z.unknown()),
  defaultConfig: z.record(z.string(), z.unknown()).optional(),
  defaultContent: z.record(z.string(), z.unknown()).optional(),
  allowedPageTypes: z.array(pageTypeSchema).optional(),
  allowedSlots: z.array(z.string().max(64)).optional(),
  dataRequirements: z.record(z.string(), z.unknown()).optional(),
  cachePolicy: cachePolicySchema.optional(),
  seoPolicy: z.record(z.string(), z.unknown()).optional(),
  hydrationStrategy: hydrationStrategySchema.optional(),
});

export const blockInstanceSchema = z.object({
  slotKey: z.string().min(1).max(64),
  blockVersionId: z.string().min(1),
  instanceKey: z.string().min(1).max(128),
  sortOrder: z.number().int().min(0).max(999),
  config: z.record(z.string(), z.unknown()).optional(),
  contentRef: z.string().max(256).nullable().optional(),
  visibilityRules: visibilityRulesSchema.nullable().optional(),
  experimentRef: z.string().max(128).nullable().optional(),
  personalizationRules: z.record(z.string(), z.unknown()).nullable().optional(),
});

// ─── Section ───

export const createSectionDefinitionSchema = z.object({
  storefrontId: storefrontIdSchema.nullable().optional(),
  code: slugSchema,
  name: z.string().min(1).max(256),
  allowedPageTypes: z.array(pageTypeSchema).optional(),
  compositionSchema: z.record(z.string(), z.unknown()).optional(),
});

export const sectionInstanceSchema = z.object({
  sectionDefinitionId: z.string().min(1),
  slotKey: z.string().min(1).max(64),
  sortOrder: z.number().int().min(0).max(999),
  sectionConfig: z.record(z.string(), z.unknown()).optional(),
});

// ─── Content Entry ───

export const createContentEntrySchema = z.object({
  storefrontId: storefrontIdSchema,
  contentType: z.string().min(1).max(64),
  code: slugSchema,
  locale: localeCodeSchema,
  schema: z.record(z.string(), z.unknown()).optional(),
  data: z.record(z.string(), z.unknown()),
  scheduleStart: z.string().datetime().nullable().optional(),
  scheduleEnd: z.string().datetime().nullable().optional(),
});

export const updateContentEntrySchema = z.object({
  data: z.record(z.string(), z.unknown()).optional(),
  state: contentEntryStateSchema.optional(),
  scheduleStart: z.string().datetime().nullable().optional(),
  scheduleEnd: z.string().datetime().nullable().optional(),
});

// ─── Navigation ───

export const navigationMenuItemSchema: z.ZodType<{
  label: string;
  itemType: "link" | "page-ref" | "external" | "divider" | "heading";
  href?: string | null;
  pageRef?: string | null;
  externalTarget?: string | null;
  sortOrder: number;
  visibilityRules?: {
    startDate?: string;
    endDate?: string;
    audiences?: string[];
    devices?: ("mobile" | "tablet" | "desktop")[];
    geoRegions?: string[];
  } | null;
  children?: {
    label: string;
    itemType: "link" | "page-ref" | "external" | "divider" | "heading";
    href?: string | null;
    pageRef?: string | null;
    externalTarget?: string | null;
    sortOrder: number;
    visibilityRules?: {
      startDate?: string;
      endDate?: string;
      audiences?: string[];
      devices?: ("mobile" | "tablet" | "desktop")[];
      geoRegions?: string[];
    } | null;
    children?: unknown[];
  }[];
}> = z.lazy(() =>
  z.object({
    label: z.string().min(1).max(128),
    itemType: navigationItemTypeSchema,
    href: z.string().max(2048).nullable().optional(),
    pageRef: z.string().max(128).nullable().optional(),
    externalTarget: z.string().max(64).nullable().optional(),
    sortOrder: z.number().int().min(0).max(999),
    visibilityRules: visibilityRulesSchema.nullable().optional(),
    children: z.array(navigationMenuItemSchema).max(50).optional(),
  }),
);

export const createNavigationMenuSchema = z.object({
  storefrontId: storefrontIdSchema,
  code: slugSchema,
  name: z.string().min(1).max(256),
  locale: localeCodeSchema,
  items: z.array(navigationMenuItemSchema).max(100),
});

export const updateNavigationMenuSchema = z.object({
  name: z.string().min(1).max(256).optional(),
  items: z.array(navigationMenuItemSchema).max(100).optional(),
  state: publishStateSchema.optional(),
});

// ─── SEO ───

export const createSeoProfileSchema = z.object({
  storefrontId: storefrontIdSchema,
  code: slugSchema,
  titleTemplate: z.string().min(1).max(512),
  descriptionTemplate: z.string().max(1024).optional(),
  robots: z.string().max(256).optional(),
  canonicalStrategy: z.enum(["path-based", "domain-based", "custom"]).optional(),
  structuredDataConfig: z.record(z.string(), z.unknown()).optional(),
  socialMeta: z.record(z.string(), z.unknown()).optional(),
});

export const updateSeoProfileSchema = z.object({
  titleTemplate: z.string().min(1).max(512).optional(),
  descriptionTemplate: z.string().max(1024).optional(),
  robots: z.string().max(256).optional(),
  canonicalStrategy: z.enum(["path-based", "domain-based", "custom"]).optional(),
  structuredDataConfig: z.record(z.string(), z.unknown()).optional(),
  socialMeta: z.record(z.string(), z.unknown()).optional(),
});

// ─── Redirect ───

export const createRedirectRuleSchema = z.object({
  storefrontId: storefrontIdSchema,
  sourcePath: routePathSchema,
  destinationPath: z.string().min(1).max(2048),
  httpStatus: redirectHttpStatusSchema.optional(),
});

export const updateRedirectRuleSchema = z.object({
  destinationPath: z.string().min(1).max(2048).optional(),
  httpStatus: redirectHttpStatusSchema.optional(),
  active: z.boolean().optional(),
});

// ─── Preview & Publish ───

export const createPreviewSessionSchema = z.object({
  storefrontId: storefrontIdSchema,
  scopeType: previewScopeTypeSchema,
  scopeId: z.string().min(1).max(128),
  ttlSeconds: z.number().int().min(60).max(7200).optional(),
});

export const createPublishJobSchema = z.object({
  storefrontId: storefrontIdSchema,
  targetType: publishTargetTypeSchema,
  targetId: z.string().min(1).max(128),
  sourceVersion: semanticVersionSchema,
  targetVersion: semanticVersionSchema,
});

// ─── Query Schemas ───

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).optional(),
  perPage: z.coerce.number().int().min(1).max(100).optional(),
});

export const storefrontQuerySchema = paginationSchema.extend({
  status: storefrontStatusSchema.optional(),
});

export const blockQuerySchema = paginationSchema.extend({
  category: blockCategorySchema.optional(),
  status: blockStatusSchema.optional(),
});

export const contentQuerySchema = paginationSchema.extend({
  contentType: z.string().max(64).optional(),
  state: contentEntryStateSchema.optional(),
  locale: localeCodeSchema.optional(),
});

// ─── Type Exports ───

export type CreateStorefront = z.infer<typeof createStorefrontSchema>;
export type UpdateStorefront = z.infer<typeof updateStorefrontSchema>;
export type CreateDomainMapping = z.infer<typeof createDomainMappingSchema>;
export type UpdateDomainMapping = z.infer<typeof updateDomainMappingSchema>;
export type CreateTheme = z.infer<typeof createThemeSchema>;
export type UpdateTheme = z.infer<typeof updateThemeSchema>;
export type CreateThemeVersion = z.infer<typeof createThemeVersionSchema>;
export type ThemeToken = z.infer<typeof themeTokenSchema>;
export type CreateThemeTokenSet = z.infer<typeof createThemeTokenSetSchema>;
export type UpdateThemeTokenSet = z.infer<typeof updateThemeTokenSetSchema>;
export type CreateLayoutTemplate = z.infer<typeof createLayoutTemplateSchema>;
export type UpdateLayoutTemplate = z.infer<typeof updateLayoutTemplateSchema>;
export type LayoutSlot = z.infer<typeof layoutSlotSchema>;
export type CreateLayoutVersion = z.infer<typeof createLayoutVersionSchema>;
export type CreatePageDefinition = z.infer<typeof createPageDefinitionSchema>;
export type UpdatePageDefinition = z.infer<typeof updatePageDefinitionSchema>;
export type CreatePageVersion = z.infer<typeof createPageVersionSchema>;
export type PageRoute = z.infer<typeof pageRouteSchema>;
export type CreateBlockDefinition = z.infer<typeof createBlockDefinitionSchema>;
export type UpdateBlockDefinition = z.infer<typeof updateBlockDefinitionSchema>;
export type CreateBlockVersion = z.infer<typeof createBlockVersionSchema>;
export type BlockInstance = z.infer<typeof blockInstanceSchema>;
export type CreateSectionDefinition = z.infer<typeof createSectionDefinitionSchema>;
export type SectionInstance = z.infer<typeof sectionInstanceSchema>;
export type CreateContentEntry = z.infer<typeof createContentEntrySchema>;
export type UpdateContentEntry = z.infer<typeof updateContentEntrySchema>;
export type NavigationMenuItem = z.infer<typeof navigationMenuItemSchema>;
export type CreateNavigationMenu = z.infer<typeof createNavigationMenuSchema>;
export type UpdateNavigationMenu = z.infer<typeof updateNavigationMenuSchema>;
export type CreateSeoProfile = z.infer<typeof createSeoProfileSchema>;
export type UpdateSeoProfile = z.infer<typeof updateSeoProfileSchema>;
export type CreateRedirectRule = z.infer<typeof createRedirectRuleSchema>;
export type UpdateRedirectRule = z.infer<typeof updateRedirectRuleSchema>;
export type CreatePreviewSession = z.infer<typeof createPreviewSessionSchema>;
export type CreatePublishJob = z.infer<typeof createPublishJobSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type StorefrontQuery = z.infer<typeof storefrontQuerySchema>;
export type BlockQuery = z.infer<typeof blockQuerySchema>;
export type ContentQuery = z.infer<typeof contentQuerySchema>;
export type SeoMeta = z.infer<typeof seoMetaSchema>;
export type CachePolicy = z.infer<typeof cachePolicySchema>;
export type VisibilityRules = z.infer<typeof visibilityRulesSchema>;
