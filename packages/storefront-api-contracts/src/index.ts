import { z } from "zod";
import {
  createStorefrontSchema,
  updateStorefrontSchema,
  createDomainMappingSchema,
  updateDomainMappingSchema,
  createThemeSchema,
  updateThemeSchema,
  createThemeVersionSchema,
  createThemeTokenSetSchema,
  updateThemeTokenSetSchema,
  createLayoutTemplateSchema,
  updateLayoutTemplateSchema,
  createLayoutVersionSchema,
  createPageDefinitionSchema,
  updatePageDefinitionSchema,
  createPageVersionSchema,
  pageRouteSchema,
  createBlockDefinitionSchema,
  updateBlockDefinitionSchema,
  createBlockVersionSchema,
  blockInstanceSchema,
  createContentEntrySchema,
  updateContentEntrySchema,
  createNavigationMenuSchema,
  updateNavigationMenuSchema,
  createSeoProfileSchema,
  updateSeoProfileSchema,
  createRedirectRuleSchema,
  updateRedirectRuleSchema,
  createPreviewSessionSchema,
  createPublishJobSchema,
  paginationSchema,
  seoMetaSchema,
  cachePolicySchema,
  visibilityRulesSchema,
  storefrontStatusSchema,
  publishStateSchema,
  pageTypeSchema,
  blockCategorySchema,
  blockStatusSchema,
  themeModeSchema,
  tokenGroupSchema,
  tokenTypeSchema,
  hydrationStrategySchema,
  routeTypeSchema,
  routeStatusSchema,
  redirectHttpStatusSchema,
  publishJobStatusSchema,
} from "@arch/storefront-validation";

// ─── Response Envelope ───

export function successEnvelope<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: z
      .object({
        page: z.number().optional(),
        perPage: z.number().optional(),
        total: z.number().optional(),
        totalPages: z.number().optional(),
      })
      .optional(),
  });
}

export const errorEnvelope = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(z.record(z.string(), z.unknown())).optional(),
  }),
});

// ─── Shared ID Params ───

export const storefrontIdParam = z.object({ storefrontId: z.string() });
export const themeIdParam = z.object({ storefrontId: z.string(), themeId: z.string() });
export const themeVersionIdParam = z.object({
  storefrontId: z.string(),
  themeId: z.string(),
  versionId: z.string(),
});
export const layoutIdParam = z.object({ storefrontId: z.string(), layoutId: z.string() });
export const pageIdParam = z.object({ storefrontId: z.string(), pageId: z.string() });
export const blockIdParam = z.object({ blockId: z.string() });
export const blockVersionIdParam = z.object({ blockId: z.string(), versionId: z.string() });

// ─── Storefront Response Schemas ───

export const storefrontResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  code: z.string(),
  name: z.string(),
  status: storefrontStatusSchema,
  defaultLocale: z.string(),
  supportedLocales: z.array(z.string()),
  primaryDomain: z.string().nullable(),
  seoDefaults: seoMetaSchema,
  featureFlags: z.record(z.string(), z.boolean()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const domainMappingResponseSchema = z.object({
  id: z.string(),
  storefrontId: z.string(),
  hostname: z.string(),
  isPrimary: z.boolean(),
  redirectBehavior: z.string(),
  sslStatus: z.string(),
  verificationStatus: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const themeResponseSchema = z.object({
  id: z.string(),
  storefrontId: z.string(),
  code: z.string(),
  name: z.string(),
  status: storefrontStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const themeVersionResponseSchema = z.object({
  id: z.string(),
  themeId: z.string(),
  version: z.string(),
  state: publishStateSchema,
  baseThemeRef: z.string().nullable(),
  description: z.string(),
  createdBy: z.string(),
  publishedBy: z.string().nullable(),
  createdAt: z.string(),
  publishedAt: z.string().nullable(),
});

export const themeTokenSetResponseSchema = z.object({
  id: z.string(),
  themeVersionId: z.string(),
  mode: themeModeSchema,
  status: z.string(),
  tokens: z.array(
    z.object({
      id: z.string(),
      group: tokenGroupSchema,
      name: z.string(),
      value: z.string(),
      type: tokenTypeSchema,
      reference: z.string().nullable(),
      metadata: z.record(z.string(), z.unknown()),
    }),
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const layoutTemplateResponseSchema = z.object({
  id: z.string(),
  storefrontId: z.string(),
  code: z.string(),
  name: z.string(),
  pageType: pageTypeSchema,
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const layoutVersionResponseSchema = z.object({
  id: z.string(),
  layoutTemplateId: z.string(),
  version: z.string(),
  state: publishStateSchema,
  schema: z.record(z.string(), z.unknown()),
  slots: z.array(
    z.object({
      id: z.string(),
      slotKey: z.string(),
      displayName: z.string(),
      allowedBlockCategories: z.array(blockCategorySchema),
      minBlocks: z.number(),
      maxBlocks: z.number(),
      required: z.boolean(),
    }),
  ),
  createdBy: z.string(),
  publishedBy: z.string().nullable(),
  createdAt: z.string(),
  publishedAt: z.string().nullable(),
});

export const pageDefinitionResponseSchema = z.object({
  id: z.string(),
  storefrontId: z.string(),
  code: z.string(),
  pageType: pageTypeSchema,
  name: z.string(),
  seoProfileId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const pageVersionResponseSchema = z.object({
  id: z.string(),
  pageDefinitionId: z.string(),
  layoutVersionId: z.string(),
  version: z.string(),
  state: publishStateSchema,
  locale: z.string(),
  title: z.string(),
  description: z.string(),
  blocks: z.array(
    z.object({
      id: z.string(),
      slotKey: z.string(),
      blockVersionId: z.string(),
      instanceKey: z.string(),
      sortOrder: z.number(),
      config: z.record(z.string(), z.unknown()),
      contentRef: z.string().nullable(),
      visibilityRules: visibilityRulesSchema.nullable(),
    }),
  ),
  createdBy: z.string(),
  publishedBy: z.string().nullable(),
  createdAt: z.string(),
  publishedAt: z.string().nullable(),
});

export const blockDefinitionResponseSchema = z.object({
  id: z.string(),
  code: z.string(),
  category: blockCategorySchema,
  displayName: z.string(),
  description: z.string(),
  icon: z.string(),
  status: blockStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const blockVersionResponseSchema = z.object({
  id: z.string(),
  blockDefinitionId: z.string(),
  version: z.string(),
  state: publishStateSchema,
  configSchema: z.record(z.string(), z.unknown()),
  contentSchema: z.record(z.string(), z.unknown()),
  defaultConfig: z.record(z.string(), z.unknown()),
  defaultContent: z.record(z.string(), z.unknown()),
  allowedPageTypes: z.array(pageTypeSchema),
  allowedSlots: z.array(z.string()),
  hydrationStrategy: hydrationStrategySchema,
  deprecationStatus: z.string(),
  cachePolicy: cachePolicySchema,
  createdAt: z.string(),
  publishedAt: z.string().nullable(),
});

export const contentEntryResponseSchema = z.object({
  id: z.string(),
  storefrontId: z.string(),
  contentType: z.string(),
  code: z.string(),
  locale: z.string(),
  state: z.string(),
  data: z.record(z.string(), z.unknown()),
  scheduleStart: z.string().nullable(),
  scheduleEnd: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const navigationMenuResponseSchema = z.object({
  id: z.string(),
  storefrontId: z.string(),
  code: z.string(),
  name: z.string(),
  locale: z.string(),
  state: publishStateSchema,
  items: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      itemType: z.string(),
      href: z.string().nullable(),
      pageRef: z.string().nullable(),
      sortOrder: z.number(),
      children: z.array(z.unknown()),
    }),
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const seoProfileResponseSchema = z.object({
  id: z.string(),
  storefrontId: z.string(),
  code: z.string(),
  titleTemplate: z.string(),
  descriptionTemplate: z.string(),
  robots: z.string(),
  canonicalStrategy: z.string(),
  structuredDataConfig: z.record(z.string(), z.unknown()),
  socialMeta: z.record(z.string(), z.unknown()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const redirectRuleResponseSchema = z.object({
  id: z.string(),
  storefrontId: z.string(),
  sourcePath: z.string(),
  destinationPath: z.string(),
  httpStatus: redirectHttpStatusSchema,
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const previewSessionResponseSchema = z.object({
  id: z.string(),
  storefrontId: z.string(),
  actorId: z.string(),
  scopeType: z.string(),
  scopeId: z.string(),
  token: z.string(),
  expiresAt: z.string(),
  revokedAt: z.string().nullable(),
  createdAt: z.string(),
});

export const publishJobResponseSchema = z.object({
  id: z.string(),
  storefrontId: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  sourceVersion: z.string(),
  targetVersion: z.string(),
  status: publishJobStatusSchema,
  validationReport: z.record(z.string(), z.unknown()),
  createdBy: z.string(),
  createdAt: z.string(),
  completedAt: z.string().nullable(),
});

// ─── Theme Lint Response ───

export const themeLintResponseSchema = z.object({
  valid: z.boolean(),
  missingTokens: z.array(z.string()),
  contrastFailures: z.array(
    z.object({
      foreground: z.string(),
      background: z.string(),
      ratio: z.number(),
      passesAA: z.boolean(),
      passesAALarge: z.boolean(),
    }),
  ),
  warnings: z.array(z.string()),
});

// ─── Compiled Theme CSS Response ───

export const themeCssResponseSchema = z.object({
  cssText: z.string(),
  cssVariables: z.record(z.string(), z.string()),
});

// ─── Public Delivery Schemas ───

export const resolvedPageResponseSchema = z.object({
  storefront: storefrontResponseSchema.pick({
    id: true,
    code: true,
    name: true,
    defaultLocale: true,
  }),
  page: z.object({
    id: z.string(),
    code: z.string(),
    pageType: pageTypeSchema,
    title: z.string(),
    description: z.string(),
    locale: z.string(),
  }),
  layout: z.object({
    id: z.string(),
    code: z.string(),
    slots: z.array(
      z.object({
        slotKey: z.string(),
        displayName: z.string(),
        blocks: z.array(
          z.object({
            instanceKey: z.string(),
            blockCode: z.string(),
            blockVersion: z.string(),
            config: z.record(z.string(), z.unknown()),
            content: z.record(z.string(), z.unknown()).nullable(),
            hydrationStrategy: hydrationStrategySchema,
          }),
        ),
      }),
    ),
  }),
  theme: z.object({
    id: z.string(),
    code: z.string(),
    cssText: z.string(),
    tokens: z.record(z.string(), z.string()),
  }),
  seo: seoMetaSchema,
  navigation: z.record(
    z.string(),
    z.object({
      items: z.array(z.unknown()),
    }),
  ),
});

// ─── Re-export request schemas ───

export {
  createStorefrontSchema,
  updateStorefrontSchema,
  createDomainMappingSchema,
  updateDomainMappingSchema,
  createThemeSchema,
  updateThemeSchema,
  createThemeVersionSchema,
  createThemeTokenSetSchema,
  updateThemeTokenSetSchema,
  createLayoutTemplateSchema,
  updateLayoutTemplateSchema,
  createLayoutVersionSchema,
  createPageDefinitionSchema,
  updatePageDefinitionSchema,
  createPageVersionSchema,
  pageRouteSchema,
  createBlockDefinitionSchema,
  updateBlockDefinitionSchema,
  createBlockVersionSchema,
  blockInstanceSchema,
  createContentEntrySchema,
  updateContentEntrySchema,
  createNavigationMenuSchema,
  updateNavigationMenuSchema,
  createSeoProfileSchema,
  updateSeoProfileSchema,
  createRedirectRuleSchema,
  updateRedirectRuleSchema,
  createPreviewSessionSchema,
  createPublishJobSchema,
  paginationSchema,
};

// ─── Type Re-exports ───

export type StorefrontResponse = z.infer<typeof storefrontResponseSchema>;
export type DomainMappingResponse = z.infer<typeof domainMappingResponseSchema>;
export type ThemeResponse = z.infer<typeof themeResponseSchema>;
export type ThemeVersionResponse = z.infer<typeof themeVersionResponseSchema>;
export type ThemeTokenSetResponse = z.infer<typeof themeTokenSetResponseSchema>;
export type LayoutTemplateResponse = z.infer<typeof layoutTemplateResponseSchema>;
export type LayoutVersionResponse = z.infer<typeof layoutVersionResponseSchema>;
export type PageDefinitionResponse = z.infer<typeof pageDefinitionResponseSchema>;
export type PageVersionResponse = z.infer<typeof pageVersionResponseSchema>;
export type BlockDefinitionResponse = z.infer<typeof blockDefinitionResponseSchema>;
export type BlockVersionResponse = z.infer<typeof blockVersionResponseSchema>;
export type ContentEntryResponse = z.infer<typeof contentEntryResponseSchema>;
export type NavigationMenuResponse = z.infer<typeof navigationMenuResponseSchema>;
export type SeoProfileResponse = z.infer<typeof seoProfileResponseSchema>;
export type RedirectRuleResponse = z.infer<typeof redirectRuleResponseSchema>;
export type PreviewSessionResponse = z.infer<typeof previewSessionResponseSchema>;
export type PublishJobResponse = z.infer<typeof publishJobResponseSchema>;
export type ThemeLintResponse = z.infer<typeof themeLintResponseSchema>;
export type ThemeCssResponse = z.infer<typeof themeCssResponseSchema>;
export type ResolvedPageResponse = z.infer<typeof resolvedPageResponseSchema>;
