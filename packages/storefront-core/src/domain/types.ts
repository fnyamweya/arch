// ─── Storefront ───
export const StorefrontStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  MAINTENANCE: "maintenance",
  SUSPENDED: "suspended",
} as const;
export type StorefrontStatus = (typeof StorefrontStatus)[keyof typeof StorefrontStatus];

// ─── Publish State ───
export const PublishState = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
  SUPERSEDED: "superseded",
} as const;
export type PublishState = (typeof PublishState)[keyof typeof PublishState];

// ─── Page Types ───
export const PageType = {
  HOME: "home",
  COLLECTION_LIST: "collection-list",
  COLLECTION_DETAIL: "collection-detail",
  PRODUCT_DETAIL: "product-detail",
  SEARCH: "search",
  CART: "cart",
  ACCOUNT: "account",
  CUSTOM: "custom",
  CAMPAIGN_LANDING: "campaign-landing",
  LEGAL_CONTENT: "legal-content",
} as const;
export type PageType = (typeof PageType)[keyof typeof PageType];

// ─── Route Types ───
export const RouteType = {
  STATIC: "static",
  DYNAMIC: "dynamic",
  PATTERN: "pattern",
  CATCH_ALL: "catch-all",
  SYSTEM: "system",
} as const;
export type RouteType = (typeof RouteType)[keyof typeof RouteType];

// ─── Route Status ───
export const RouteStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  REDIRECT: "redirect",
} as const;
export type RouteStatus = (typeof RouteStatus)[keyof typeof RouteStatus];

// ─── Token Groups ───
export const TokenGroup = {
  COLOR: "color",
  TYPOGRAPHY: "typography",
  SPACING: "spacing",
  RADIUS: "radius",
  SHADOW: "shadow",
  BORDER: "border",
  MOTION: "motion",
  ELEVATION: "elevation",
  GRID: "grid",
  ICONOGRAPHY: "iconography",
  ILLUSTRATION: "illustration",
} as const;
export type TokenGroup = (typeof TokenGroup)[keyof typeof TokenGroup];

// ─── Token Types ───
export const TokenType = {
  COLOR: "color",
  DIMENSION: "dimension",
  FONT_FAMILY: "fontFamily",
  FONT_WEIGHT: "fontWeight",
  FONT_SIZE: "fontSize",
  LINE_HEIGHT: "lineHeight",
  LETTER_SPACING: "letterSpacing",
  DURATION: "duration",
  CUBIC_BEZIER: "cubicBezier",
  NUMBER: "number",
  STRING: "string",
  SHADOW: "shadow",
  BORDER: "border",
  GRADIENT: "gradient",
  COMPOSITE: "composite",
} as const;
export type TokenType = (typeof TokenType)[keyof typeof TokenType];

// ─── Theme Mode ───
export const ThemeMode = {
  DEFAULT: "default",
  DARK: "dark",
  HIGH_CONTRAST: "high-contrast",
  CAMPAIGN: "campaign",
} as const;
export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];

// ─── Token Set Status ───
export const TokenSetStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;
export type TokenSetStatus = (typeof TokenSetStatus)[keyof typeof TokenSetStatus];

// ─── Block Categories ───
export const BlockCategory = {
  HERO: "hero",
  MERCHANDISING: "merchandising",
  CATEGORY_NAVIGATION: "category-navigation",
  COLLECTION_PROMO: "collection-promo",
  PRODUCT_GRID: "product-grid",
  PRODUCT_CAROUSEL: "product-carousel",
  RICH_CONTENT: "rich-content",
  FAQ: "faq",
  TESTIMONIAL: "testimonial",
  TRUST: "trust",
  BANNER: "banner",
  ANNOUNCEMENT: "announcement",
  MEDIA_GALLERY: "media-gallery",
  COMPARISON: "comparison",
  NEWSLETTER: "newsletter",
  SOCIAL_PROOF: "social-proof",
  FOOTER: "footer",
  BREADCRUMBS: "breadcrumbs",
  SEO_CONTENT: "seo-content",
  CTA: "cta",
  EDITORIAL: "editorial",
} as const;
export type BlockCategory = (typeof BlockCategory)[keyof typeof BlockCategory];

// ─── Block Status ───
export const BlockStatus = {
  ACTIVE: "active",
  DEPRECATED: "deprecated",
  RETIRED: "retired",
} as const;
export type BlockStatus = (typeof BlockStatus)[keyof typeof BlockStatus];

// ─── Hydration Strategy ───
export const HydrationStrategy = {
  SERVER_ONLY: "server-only",
  CLIENT_ONLY: "client-only",
  PROGRESSIVE: "progressive",
  ISLAND: "island",
} as const;
export type HydrationStrategy = (typeof HydrationStrategy)[keyof typeof HydrationStrategy];

// ─── Deprecation Status ───
export const DeprecationStatus = {
  NONE: "none",
  SOFT: "soft",
  HARD: "hard",
  DEPRECATED: "deprecated",
  SUNSET: "sunset",
} as const;
export type DeprecationStatus = (typeof DeprecationStatus)[keyof typeof DeprecationStatus];

// ─── Domain Mapping ───
export const SslStatus = {
  PENDING: "pending",
  ACTIVE: "active",
  FAILED: "failed",
} as const;
export type SslStatus = (typeof SslStatus)[keyof typeof SslStatus];

export const VerificationStatus = {
  PENDING: "pending",
  VERIFIED: "verified",
  FAILED: "failed",
} as const;
export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus];

export const RedirectBehavior = {
  NONE: "none",
  PERMANENT: "permanent",
  TEMPORARY: "temporary",
} as const;
export type RedirectBehavior = (typeof RedirectBehavior)[keyof typeof RedirectBehavior];

// ─── Preview Scope ───
export const PreviewScopeType = {
  STOREFRONT: "storefront",
  PAGE: "page",
  THEME: "theme",
  LAYOUT: "layout",
} as const;
export type PreviewScopeType = (typeof PreviewScopeType)[keyof typeof PreviewScopeType];

// ─── Publish Job ───
export const PublishTargetType = {
  THEME_VERSION: "theme-version",
  LAYOUT_VERSION: "layout-version",
  PAGE_VERSION: "page-version",
  CONTENT_ENTRY: "content-entry",
  NAVIGATION_MENU: "navigation-menu",
} as const;
export type PublishTargetType = (typeof PublishTargetType)[keyof typeof PublishTargetType];

export const PublishJobStatus = {
  PENDING: "pending",
  VALIDATING: "validating",
  PUBLISHING: "publishing",
  COMPLETED: "completed",
  FAILED: "failed",
  ROLLED_BACK: "rolled-back",
} as const;
export type PublishJobStatus = (typeof PublishJobStatus)[keyof typeof PublishJobStatus];

// ─── Navigation Item Type ───
export const NavigationItemType = {
  LINK: "link",
  INTERNAL: "internal",
  EXTERNAL: "external",
  PAGE_REF: "page-ref",
  DIVIDER: "divider",
  HEADING: "heading",
} as const;
export type NavigationItemType = (typeof NavigationItemType)[keyof typeof NavigationItemType];

// ─── Section Status ───
export const SectionStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;
export type SectionStatus = (typeof SectionStatus)[keyof typeof SectionStatus];

// ─── Content Entry State ───
export const ContentEntryState = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
  SCHEDULED: "scheduled",
} as const;
export type ContentEntryState = (typeof ContentEntryState)[keyof typeof ContentEntryState];

// ─── Redirect HTTP Status ───
export const RedirectHttpStatus = {
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,
} as const;
export type RedirectHttpStatus = (typeof RedirectHttpStatus)[keyof typeof RedirectHttpStatus];

// ─── SEO Meta ───
export interface SeoMeta {
  readonly title?: string;
  readonly description?: string;
  readonly robots?: string;
  readonly canonicalUrl?: string;
  readonly ogTitle?: string;
  readonly ogDescription?: string;
  readonly ogImage?: string;
  readonly twitterCard?: string;
  readonly structuredData?: Record<string, unknown>;
}

// ─── Cache Policy ───
export interface CachePolicy {
  readonly maxAge: number;
  readonly staleWhileRevalidate?: number;
  readonly tags: readonly string[];
  readonly varyBy?: readonly string[];
}

// ─── Visibility Rules ───
export interface VisibilityRules {
  readonly startDate?: string;
  readonly endDate?: string;
  readonly locales?: readonly string[];
  readonly segments?: readonly string[];
  readonly devices?: readonly string[];
}
