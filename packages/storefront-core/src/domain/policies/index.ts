import type { PublishState, PageType, BlockCategory } from "../types";

/**
 * Determines whether a resource can transition to the given publish state.
 */
export function canTransitionTo(current: PublishState, target: PublishState): boolean {
  const transitions: Record<PublishState, readonly PublishState[]> = {
    draft: ["published"],
    published: ["archived", "superseded"],
    archived: ["draft"],
    superseded: [],
  };
  return (transitions[current] ?? []).includes(target);
}

/**
 * Required semantic token names that must exist before a theme can be published.
 */
export const REQUIRED_SEMANTIC_TOKENS: readonly string[] = [
  "color-background",
  "color-foreground",
  "color-primary",
  "color-primary-foreground",
  "color-secondary",
  "color-secondary-foreground",
  "color-muted",
  "color-muted-foreground",
  "color-accent",
  "color-accent-foreground",
  "color-destructive",
  "color-destructive-foreground",
  "color-border",
  "color-input",
  "color-ring",
  "color-card",
  "color-card-foreground",
  "color-popover",
  "color-popover-foreground",
  "font-family-heading",
  "font-family-body",
  "font-size-xs",
  "font-size-sm",
  "font-size-base",
  "font-size-lg",
  "font-size-xl",
  "font-size-2xl",
  "font-size-3xl",
  "font-size-4xl",
  "spacing-1",
  "spacing-2",
  "spacing-3",
  "spacing-4",
  "spacing-6",
  "spacing-8",
  "spacing-12",
  "spacing-16",
  "radius-sm",
  "radius-md",
  "radius-lg",
  "radius-full",
] as const;

/**
 * Minimum WCAG AA contrast ratio for normal text.
 */
export const WCAG_AA_CONTRAST_NORMAL = 4.5;

/**
 * Minimum WCAG AA contrast ratio for large text/UI components.
 */
export const WCAG_AA_CONTRAST_LARGE = 3.0;

/**
 * Required foreground/background pairs for contrast validation.
 */
export const CONTRAST_PAIRS: readonly { foreground: string; background: string; level: "normal" | "large" }[] = [
  { foreground: "color-foreground", background: "color-background", level: "normal" },
  { foreground: "color-primary-foreground", background: "color-primary", level: "normal" },
  { foreground: "color-secondary-foreground", background: "color-secondary", level: "normal" },
  { foreground: "color-muted-foreground", background: "color-muted", level: "large" },
  { foreground: "color-accent-foreground", background: "color-accent", level: "normal" },
  { foreground: "color-destructive-foreground", background: "color-destructive", level: "normal" },
  { foreground: "color-card-foreground", background: "color-card", level: "normal" },
  { foreground: "color-popover-foreground", background: "color-popover", level: "normal" },
];

/**
 * Default allowed block categories per page type.
 */
export const PAGE_TYPE_BLOCK_CATEGORIES: Record<PageType, readonly BlockCategory[]> = {
  home: [
    "hero", "merchandising", "category-navigation", "collection-promo",
    "product-grid", "product-carousel", "rich-content", "faq",
    "testimonial", "trust", "banner", "announcement", "media-gallery",
    "newsletter", "social-proof", "footer", "breadcrumbs", "seo-content",
    "cta", "editorial", "comparison",
  ],
  "collection-list": [
    "hero", "category-navigation", "breadcrumbs", "banner",
    "rich-content", "footer", "seo-content", "newsletter",
  ],
  "collection-detail": [
    "hero", "product-grid", "product-carousel", "breadcrumbs",
    "banner", "rich-content", "footer", "seo-content", "newsletter",
    "trust", "social-proof",
  ],
  "product-detail": [
    "breadcrumbs", "product-carousel", "rich-content", "faq",
    "testimonial", "trust", "social-proof", "comparison", "footer",
    "seo-content", "newsletter", "cta",
  ],
  search: [
    "breadcrumbs", "product-grid", "banner", "footer", "seo-content",
  ],
  cart: [
    "breadcrumbs", "trust", "banner", "footer", "cta",
  ],
  account: [
    "breadcrumbs", "banner", "footer",
  ],
  custom: [
    "hero", "merchandising", "category-navigation", "collection-promo",
    "product-grid", "product-carousel", "rich-content", "faq",
    "testimonial", "trust", "banner", "announcement", "media-gallery",
    "newsletter", "social-proof", "footer", "breadcrumbs", "seo-content",
    "cta", "editorial", "comparison",
  ],
  "campaign-landing": [
    "hero", "merchandising", "collection-promo", "product-grid",
    "product-carousel", "rich-content", "testimonial", "trust",
    "banner", "media-gallery", "newsletter", "social-proof",
    "cta", "editorial", "comparison", "footer",
  ],
  "legal-content": [
    "breadcrumbs", "rich-content", "footer", "seo-content",
  ],
};

/**
 * Maximum preview session TTL in seconds (2 hours).
 */
export const MAX_PREVIEW_SESSION_TTL_SECONDS = 7200;

/**
 * Default preview session TTL in seconds (30 minutes).
 */
export const DEFAULT_PREVIEW_SESSION_TTL_SECONDS = 1800;

/**
 * Maximum number of blocks per slot.
 */
export const MAX_BLOCKS_PER_SLOT = 50;

/**
 * Maximum depth for navigation menu items.
 */
export const MAX_NAVIGATION_DEPTH = 4;
