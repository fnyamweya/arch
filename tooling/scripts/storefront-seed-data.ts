/**
 * Seed data for 4 storefront tenants:
 * - UrbanNest (home & lifestyle)
 * - VoltCart (electronics)
 * - GreenBasket (organic grocery)
 * - AtelierOne (luxury fashion)
 *
 * This module exports complete seed data records that can be written to D1 tables.
 */

// ─── ID Helpers ───

let idCounter = 0;
function id(prefix: string): string {
  idCounter++;
  return `${prefix}${String(idCounter).padStart(24, "0")}`;
}

const now = new Date().toISOString();

// ──────────────────────────────────────────────────────
// BLOCK DEFINITIONS (shared across all tenants)
// ──────────────────────────────────────────────────────

export const blockDefinitions = [
  { id: id("blk_"), code: "hero-banner", category: "hero", displayName: "Hero Banner", description: "Full-width hero with heading, subheading, CTA, and background image", icon: "image", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "hero-slideshow", category: "hero", displayName: "Hero Slideshow", description: "Rotating hero slides with auto-advance", icon: "slides", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "hero-video", category: "hero", displayName: "Hero Video", description: "Hero block with background video", icon: "video", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "main-navigation", category: "navigation", displayName: "Main Navigation", description: "Primary nav bar with logo, links, search, cart", icon: "menu", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "breadcrumb-nav", category: "navigation", displayName: "Breadcrumb Navigation", description: "Breadcrumb trail for page hierarchy", icon: "chevrons-right", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "product-grid", category: "product-grid", displayName: "Product Grid", description: "Responsive grid of product cards", icon: "grid", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "product-card", category: "product-card", displayName: "Product Card", description: "Single product card with image, title, price", icon: "square", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "product-gallery", category: "product-gallery", displayName: "Product Gallery", description: "Image gallery with thumbnails and zoom", icon: "images", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "product-info", category: "product-info", displayName: "Product Info", description: "Product title, price, variants, add-to-cart", icon: "info", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "product-reviews", category: "product-reviews", displayName: "Product Reviews", description: "Customer reviews with ratings", icon: "star", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "product-recommendations", category: "product-recommendations", displayName: "Product Recommendations", description: "Algorithm-driven product suggestions", icon: "sparkles", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "collection-grid", category: "collection-grid", displayName: "Collection Grid", description: "Grid of collection cards", icon: "layout-grid", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "collection-filter", category: "collection-filter", displayName: "Collection Filter", description: "Faceted filter sidebar for collections", icon: "filter", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "cart-summary", category: "cart-summary", displayName: "Cart Summary", description: "Cart totals and checkout CTA", icon: "shopping-cart", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "cart-items-list", category: "cart-items", displayName: "Cart Items List", description: "Line items with quantity controls", icon: "list", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "account-overview", category: "account-info", displayName: "Account Overview", description: "Account dashboard with orders and profile", icon: "user", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "search-bar", category: "search-bar", displayName: "Search Bar", description: "Instant search with autocomplete", icon: "search", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "search-results-grid", category: "search-results", displayName: "Search Results", description: "Paginated search results with filters", icon: "file-search", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "rich-text", category: "content-text", displayName: "Rich Text", description: "WYSIWYG rich text content block", icon: "type", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "image-block", category: "content-image", displayName: "Image Block", description: "Single image with caption and link", icon: "image", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "video-embed", category: "content-video", displayName: "Video Embed", description: "Embedded video from YouTube/Vimeo", icon: "play-circle", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "promo-banner", category: "content-banner", displayName: "Promo Banner", description: "Announcement/promotional banner", icon: "megaphone", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "newsletter-signup", category: "content-banner", displayName: "Newsletter Signup", description: "Email subscription form", icon: "mail", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "testimonials", category: "content-text", displayName: "Testimonials", description: "Customer testimonials carousel", icon: "quote", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "faq-accordion", category: "content-text", displayName: "FAQ Accordion", description: "Collapsible FAQ section", icon: "help-circle", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "trust-badges", category: "content-image", displayName: "Trust Badges", description: "Security and trust badges row", icon: "shield", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "footer-block", category: "footer", displayName: "Footer", description: "Site footer with links, social, copyright", icon: "align-bottom", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "spacer", category: "spacer", displayName: "Spacer", description: "Vertical spacing between blocks", icon: "move-vertical", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "category-showcase", category: "collection-grid", displayName: "Category Showcase", description: "Featured categories with images", icon: "layout-grid", status: "active", createdAt: now, updatedAt: now },
  { id: id("blk_"), code: "brand-story", category: "content-text", displayName: "Brand Story", description: "Brand narrative with image and text", icon: "book-open", status: "active", createdAt: now, updatedAt: now },
];

// ──────────────────────────────────────────────────────
// TENANT 1: UrbanNest (home & lifestyle)
// ──────────────────────────────────────────────────────

const urbanNestSfId = id("sf_");
const urbanNestThemeId = id("thm_");
const urbanNestThemeVersionId = id("tv_");
const urbanNestDefaultTokenSetId = id("ts_");
const urbanNestDarkTokenSetId = id("ts_");
const urbanNestHomeLayoutId = id("lay_");
const urbanNestHomeLayoutVersionId = id("lv_");
const urbanNestPdpLayoutId = id("lay_");
const urbanNestPdpLayoutVersionId = id("lv_");
const urbanNestHomePageId = id("pg_");
const urbanNestHomePageVersionId = id("pv_");
const urbanNestSeoId = id("seo_");
const urbanNestNavMenuId = id("nm_");

export const urbanNest = {
  storefront: {
    id: urbanNestSfId,
    tenantId: "urban-nest",
    code: "urban-nest-main",
    name: "UrbanNest",
    status: "active" as const,
    defaultLocale: "en",
    supportedLocales: ["en", "es", "fr"],
    primaryDomain: "www.urbannest.com",
    seoDefaults: { title: "UrbanNest - Modern Home & Lifestyle", description: "Curated home goods and lifestyle essentials for modern living" },
    featureFlags: { darkMode: true, wishlist: true, reviews: true, quickView: true },
    createdAt: now,
    updatedAt: now,
  },

  domainMappings: [
    { id: id("dm_"), storefrontId: urbanNestSfId, hostname: "www.urbannest.com", isPrimary: true, redirectBehavior: "none" as const, sslStatus: "active" as const, verificationStatus: "verified" as const, createdAt: now, updatedAt: now },
    { id: id("dm_"), storefrontId: urbanNestSfId, hostname: "urbannest.com", isPrimary: false, redirectBehavior: "permanent" as const, sslStatus: "active" as const, verificationStatus: "verified" as const, createdAt: now, updatedAt: now },
  ],

  theme: {
    id: urbanNestThemeId,
    storefrontId: urbanNestSfId,
    code: "urban-warmth",
    name: "Urban Warmth",
    status: "active" as const,
    createdAt: now,
    updatedAt: now,
  },

  themeVersion: {
    id: urbanNestThemeVersionId,
    themeId: urbanNestThemeId,
    version: "1.0.0",
    state: "published" as const,
    baseThemeRef: null,
    description: "Warm earth tones with clean typography",
    createdBy: "admin",
    publishedBy: "admin",
    createdAt: now,
    publishedAt: now,
  },

  tokenSets: [
    { id: urbanNestDefaultTokenSetId, themeVersionId: urbanNestThemeVersionId, mode: "default" as const, status: "active" as const, createdAt: now, updatedAt: now },
    { id: urbanNestDarkTokenSetId, themeVersionId: urbanNestThemeVersionId, mode: "dark" as const, status: "active" as const, createdAt: now, updatedAt: now },
  ],

  tokens: [
    // Default mode - warm earth tones
    ...[
      { group: "color", name: "primary-500", value: "#D4A574", type: "color" },
      { group: "color", name: "primary-600", value: "#C4905E", type: "color" },
      { group: "color", name: "primary-700", value: "#A87B4F", type: "color" },
      { group: "color", name: "secondary-500", value: "#6B8F71", type: "color" },
      { group: "color", name: "neutral-50", value: "#FAF8F5", type: "color" },
      { group: "color", name: "neutral-100", value: "#F0EBE3", type: "color" },
      { group: "color", name: "neutral-900", value: "#2C2420", type: "color" },
      { group: "color", name: "surface-background", value: "#FAF8F5", type: "color" },
      { group: "color", name: "surface-foreground", value: "#2C2420", type: "color" },
      { group: "color", name: "surface-card", value: "#FFFFFF", type: "color" },
      { group: "color", name: "surface-muted", value: "#F0EBE3", type: "color" },
      { group: "color", name: "text-primary", value: "#2C2420", type: "color" },
      { group: "color", name: "text-secondary", value: "#6B5E54", type: "color" },
      { group: "color", name: "text-on-primary", value: "#FFFFFF", type: "color" },
      { group: "color", name: "border-default", value: "#DDD5CB", type: "color" },
      { group: "color", name: "error", value: "#DC3545", type: "color" },
      { group: "color", name: "success", value: "#28A745", type: "color" },
      { group: "color", name: "warning", value: "#FFC107", type: "color" },
      { group: "font", name: "family-heading", value: "'Playfair Display', serif", type: "fontFamily" },
      { group: "font", name: "family-body", value: "'Inter', sans-serif", type: "fontFamily" },
      { group: "font", name: "size-xs", value: "0.75rem", type: "fontSize" },
      { group: "font", name: "size-sm", value: "0.875rem", type: "fontSize" },
      { group: "font", name: "size-base", value: "1rem", type: "fontSize" },
      { group: "font", name: "size-lg", value: "1.125rem", type: "fontSize" },
      { group: "font", name: "size-xl", value: "1.25rem", type: "fontSize" },
      { group: "font", name: "size-2xl", value: "1.5rem", type: "fontSize" },
      { group: "font", name: "size-3xl", value: "2rem", type: "fontSize" },
      { group: "font", name: "size-4xl", value: "2.5rem", type: "fontSize" },
      { group: "font", name: "weight-normal", value: "400", type: "fontWeight" },
      { group: "font", name: "weight-medium", value: "500", type: "fontWeight" },
      { group: "font", name: "weight-semibold", value: "600", type: "fontWeight" },
      { group: "font", name: "weight-bold", value: "700", type: "fontWeight" },
      { group: "spacing", name: "xs", value: "0.25rem", type: "dimension" },
      { group: "spacing", name: "sm", value: "0.5rem", type: "dimension" },
      { group: "spacing", name: "md", value: "1rem", type: "dimension" },
      { group: "spacing", name: "lg", value: "1.5rem", type: "dimension" },
      { group: "spacing", name: "xl", value: "2rem", type: "dimension" },
      { group: "spacing", name: "2xl", value: "3rem", type: "dimension" },
      { group: "spacing", name: "3xl", value: "4rem", type: "dimension" },
      { group: "radius", name: "sm", value: "0.25rem", type: "dimension" },
      { group: "radius", name: "md", value: "0.5rem", type: "dimension" },
      { group: "radius", name: "lg", value: "0.75rem", type: "dimension" },
      { group: "radius", name: "full", value: "9999px", type: "dimension" },
      { group: "shadow", name: "sm", value: "0 1px 2px rgba(44,36,32,0.05)", type: "shadow" },
      { group: "shadow", name: "md", value: "0 4px 6px rgba(44,36,32,0.07)", type: "shadow" },
      { group: "shadow", name: "lg", value: "0 10px 15px rgba(44,36,32,0.1)", type: "shadow" },
    ].map((t) => ({ id: id("tk_"), tokenSetId: urbanNestDefaultTokenSetId, ...t, reference: null, metadata: {}, createdAt: now, updatedAt: now })),
    // Dark mode overrides
    ...[
      { group: "color", name: "surface-background", value: "#1A1614", type: "color" },
      { group: "color", name: "surface-foreground", value: "#F0EBE3", type: "color" },
      { group: "color", name: "surface-card", value: "#2C2420", type: "color" },
      { group: "color", name: "surface-muted", value: "#3D3530", type: "color" },
      { group: "color", name: "text-primary", value: "#F0EBE3", type: "color" },
      { group: "color", name: "text-secondary", value: "#B0A69C", type: "color" },
      { group: "color", name: "border-default", value: "#4A403A", type: "color" },
    ].map((t) => ({ id: id("tk_"), tokenSetId: urbanNestDarkTokenSetId, ...t, reference: null, metadata: {}, createdAt: now, updatedAt: now })),
  ],

  layouts: [
    { id: urbanNestHomeLayoutId, storefrontId: urbanNestSfId, code: "home-default", name: "Home Page Layout", pageType: "home" as const, description: "Standard home page with hero, featured, collections", createdAt: now, updatedAt: now },
    { id: urbanNestPdpLayoutId, storefrontId: urbanNestSfId, code: "pdp-default", name: "Product Detail Layout", pageType: "product-detail" as const, description: "Product page with gallery, info, reviews", createdAt: now, updatedAt: now },
  ],

  layoutVersions: [
    { id: urbanNestHomeLayoutVersionId, layoutTemplateId: urbanNestHomeLayoutId, version: "1.0.0", state: "published" as const, schema: {}, createdBy: "admin", publishedBy: "admin", createdAt: now, publishedAt: now },
    { id: urbanNestPdpLayoutVersionId, layoutTemplateId: urbanNestPdpLayoutId, version: "1.0.0", state: "published" as const, schema: {}, createdBy: "admin", publishedBy: "admin", createdAt: now, publishedAt: now },
  ],

  layoutSlots: [
    { id: id("lsd_"), layoutVersionId: urbanNestHomeLayoutVersionId, slotKey: "header", displayName: "Header", allowedBlockCategories: ["navigation"], minBlocks: 1, maxBlocks: 1, required: true, responsiveRules: {}, orderingRules: {} },
    { id: id("lsd_"), layoutVersionId: urbanNestHomeLayoutVersionId, slotKey: "hero", displayName: "Hero Section", allowedBlockCategories: ["hero", "content-banner"], minBlocks: 1, maxBlocks: 2, required: true, responsiveRules: {}, orderingRules: {} },
    { id: id("lsd_"), layoutVersionId: urbanNestHomeLayoutVersionId, slotKey: "main", displayName: "Main Content", allowedBlockCategories: ["product-grid", "collection-grid", "content-text", "content-image", "content-video", "content-banner", "product-recommendations"], minBlocks: 1, maxBlocks: 20, required: true, responsiveRules: {}, orderingRules: {} },
    { id: id("lsd_"), layoutVersionId: urbanNestHomeLayoutVersionId, slotKey: "footer", displayName: "Footer", allowedBlockCategories: ["footer"], minBlocks: 1, maxBlocks: 1, required: true, responsiveRules: {}, orderingRules: {} },
    { id: id("lsd_"), layoutVersionId: urbanNestPdpLayoutVersionId, slotKey: "header", displayName: "Header", allowedBlockCategories: ["navigation"], minBlocks: 1, maxBlocks: 1, required: true, responsiveRules: {}, orderingRules: {} },
    { id: id("lsd_"), layoutVersionId: urbanNestPdpLayoutVersionId, slotKey: "breadcrumb", displayName: "Breadcrumb", allowedBlockCategories: ["navigation"], minBlocks: 0, maxBlocks: 1, required: false, responsiveRules: {}, orderingRules: {} },
    { id: id("lsd_"), layoutVersionId: urbanNestPdpLayoutVersionId, slotKey: "productMain", displayName: "Product Main", allowedBlockCategories: ["product-gallery", "product-info"], minBlocks: 2, maxBlocks: 4, required: true, responsiveRules: {}, orderingRules: {} },
    { id: id("lsd_"), layoutVersionId: urbanNestPdpLayoutVersionId, slotKey: "productSecondary", displayName: "Product Secondary", allowedBlockCategories: ["product-reviews", "product-recommendations", "content-text"], minBlocks: 0, maxBlocks: 10, required: false, responsiveRules: {}, orderingRules: {} },
    { id: id("lsd_"), layoutVersionId: urbanNestPdpLayoutVersionId, slotKey: "footer", displayName: "Footer", allowedBlockCategories: ["footer"], minBlocks: 1, maxBlocks: 1, required: true, responsiveRules: {}, orderingRules: {} },
  ],

  pages: [
    { id: urbanNestHomePageId, storefrontId: urbanNestSfId, code: "home", pageType: "home" as const, name: "Home Page", seoProfileId: urbanNestSeoId, createdAt: now, updatedAt: now },
  ],

  pageVersions: [
    { id: urbanNestHomePageVersionId, pageDefinitionId: urbanNestHomePageId, layoutVersionId: urbanNestHomeLayoutVersionId, version: "1.0.0", state: "published" as const, locale: "en", title: "UrbanNest - Modern Home & Lifestyle", description: "Discover curated home goods for modern living", contentSchemaVersion: "1.0.0", createdBy: "admin", publishedBy: "admin", createdAt: now, publishedAt: now },
  ],

  routes: [
    { id: id("rt_"), storefrontId: urbanNestSfId, pageDefinitionId: urbanNestHomePageId, routeType: "static" as const, pathPattern: "/", locale: "en", status: "active" as const, canonicalRoute: true, createdAt: now, updatedAt: now },
  ],

  seoProfiles: [
    { id: urbanNestSeoId, storefrontId: urbanNestSfId, code: "default", titleTemplate: "{pageTitle} | UrbanNest", descriptionTemplate: "{pageTitle} - Shop curated home goods at UrbanNest", robots: "index, follow", canonicalStrategy: "path-based", structuredDataConfig: { "@type": "Organization", name: "UrbanNest" }, socialMeta: { ogSiteName: "UrbanNest" }, createdAt: now, updatedAt: now },
  ],

  navigationMenus: [
    { id: urbanNestNavMenuId, storefrontId: urbanNestSfId, code: "main-nav", name: "Main Navigation", locale: "en", state: "published" as const, createdAt: now, updatedAt: now },
  ],

  navigationItems: [
    { id: id("ni_"), navigationMenuId: urbanNestNavMenuId, parentItemId: null, label: "Living Room", itemType: "link" as const, href: "/collections/living-room", pageRef: null, externalTarget: null, sortOrder: 0, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: urbanNestNavMenuId, parentItemId: null, label: "Bedroom", itemType: "link" as const, href: "/collections/bedroom", pageRef: null, externalTarget: null, sortOrder: 1, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: urbanNestNavMenuId, parentItemId: null, label: "Kitchen", itemType: "link" as const, href: "/collections/kitchen", pageRef: null, externalTarget: null, sortOrder: 2, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: urbanNestNavMenuId, parentItemId: null, label: "Outdoor", itemType: "link" as const, href: "/collections/outdoor", pageRef: null, externalTarget: null, sortOrder: 3, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: urbanNestNavMenuId, parentItemId: null, label: "Sale", itemType: "link" as const, href: "/sale", pageRef: null, externalTarget: null, sortOrder: 4, visibilityRules: null },
  ],

  redirects: [
    { id: id("rr_"), storefrontId: urbanNestSfId, sourcePath: "/home", destinationPath: "/", httpStatus: "301" as const, active: true, createdAt: now, updatedAt: now },
  ],
};

// ──────────────────────────────────────────────────────
// TENANT 2: VoltCart (electronics)
// ──────────────────────────────────────────────────────

const voltCartSfId = id("sf_");
const voltCartThemeId = id("thm_");
const voltCartThemeVersionId = id("tv_");
const voltCartTokenSetId = id("ts_");
const voltCartSeoId = id("seo_");
const voltCartNavId = id("nm_");

export const voltCart = {
  storefront: {
    id: voltCartSfId,
    tenantId: "volt-cart",
    code: "volt-cart-main",
    name: "VoltCart",
    status: "active" as const,
    defaultLocale: "en",
    supportedLocales: ["en", "de", "ja"],
    primaryDomain: "www.voltcart.com",
    seoDefaults: { title: "VoltCart - Premium Electronics", description: "The latest tech and electronics at competitive prices" },
    featureFlags: { darkMode: true, compareTool: true, techSpecs: true, liveChat: true },
    createdAt: now,
    updatedAt: now,
  },

  domainMappings: [
    { id: id("dm_"), storefrontId: voltCartSfId, hostname: "www.voltcart.com", isPrimary: true, redirectBehavior: "none" as const, sslStatus: "active" as const, verificationStatus: "verified" as const, createdAt: now, updatedAt: now },
  ],

  theme: {
    id: voltCartThemeId,
    storefrontId: voltCartSfId,
    code: "volt-electric",
    name: "Volt Electric",
    status: "active" as const,
    createdAt: now,
    updatedAt: now,
  },

  themeVersion: {
    id: voltCartThemeVersionId,
    themeId: voltCartThemeId,
    version: "1.0.0",
    state: "published" as const,
    baseThemeRef: null,
    description: "Electric blue with dark theme optimized for electronics",
    createdBy: "admin",
    publishedBy: "admin",
    createdAt: now,
    publishedAt: now,
  },

  tokenSets: [
    { id: voltCartTokenSetId, themeVersionId: voltCartThemeVersionId, mode: "default" as const, status: "active" as const, createdAt: now, updatedAt: now },
  ],

  tokens: [
    { group: "color", name: "primary-500", value: "#3B82F6", type: "color" },
    { group: "color", name: "primary-600", value: "#2563EB", type: "color" },
    { group: "color", name: "secondary-500", value: "#8B5CF6", type: "color" },
    { group: "color", name: "surface-background", value: "#0F172A", type: "color" },
    { group: "color", name: "surface-foreground", value: "#F1F5F9", type: "color" },
    { group: "color", name: "surface-card", value: "#1E293B", type: "color" },
    { group: "color", name: "surface-muted", value: "#334155", type: "color" },
    { group: "color", name: "text-primary", value: "#F1F5F9", type: "color" },
    { group: "color", name: "text-secondary", value: "#94A3B8", type: "color" },
    { group: "color", name: "text-on-primary", value: "#FFFFFF", type: "color" },
    { group: "color", name: "border-default", value: "#334155", type: "color" },
    { group: "color", name: "error", value: "#EF4444", type: "color" },
    { group: "color", name: "success", value: "#22C55E", type: "color" },
    { group: "color", name: "warning", value: "#F59E0B", type: "color" },
    { group: "font", name: "family-heading", value: "'Space Grotesk', sans-serif", type: "fontFamily" },
    { group: "font", name: "family-body", value: "'Inter', sans-serif", type: "fontFamily" },
    { group: "spacing", name: "xs", value: "0.25rem", type: "dimension" },
    { group: "spacing", name: "sm", value: "0.5rem", type: "dimension" },
    { group: "spacing", name: "md", value: "1rem", type: "dimension" },
    { group: "spacing", name: "lg", value: "1.5rem", type: "dimension" },
    { group: "spacing", name: "xl", value: "2rem", type: "dimension" },
    { group: "radius", name: "sm", value: "0.375rem", type: "dimension" },
    { group: "radius", name: "md", value: "0.5rem", type: "dimension" },
    { group: "radius", name: "lg", value: "0.75rem", type: "dimension" },
  ].map((t) => ({ id: id("tk_"), tokenSetId: voltCartTokenSetId, ...t, reference: null, metadata: {}, createdAt: now, updatedAt: now })),

  seoProfiles: [
    { id: voltCartSeoId, storefrontId: voltCartSfId, code: "default", titleTemplate: "{pageTitle} | VoltCart", descriptionTemplate: "{pageTitle} - Shop the latest tech at VoltCart", robots: "index, follow", canonicalStrategy: "path-based", structuredDataConfig: { "@type": "Organization", name: "VoltCart" }, socialMeta: {}, createdAt: now, updatedAt: now },
  ],

  navigationMenus: [
    { id: voltCartNavId, storefrontId: voltCartSfId, code: "main-nav", name: "Main Navigation", locale: "en", state: "published" as const, createdAt: now, updatedAt: now },
  ],

  navigationItems: [
    { id: id("ni_"), navigationMenuId: voltCartNavId, parentItemId: null, label: "Smartphones", itemType: "link" as const, href: "/collections/smartphones", pageRef: null, externalTarget: null, sortOrder: 0, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: voltCartNavId, parentItemId: null, label: "Laptops", itemType: "link" as const, href: "/collections/laptops", pageRef: null, externalTarget: null, sortOrder: 1, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: voltCartNavId, parentItemId: null, label: "Audio", itemType: "link" as const, href: "/collections/audio", pageRef: null, externalTarget: null, sortOrder: 2, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: voltCartNavId, parentItemId: null, label: "Gaming", itemType: "link" as const, href: "/collections/gaming", pageRef: null, externalTarget: null, sortOrder: 3, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: voltCartNavId, parentItemId: null, label: "Deals", itemType: "link" as const, href: "/deals", pageRef: null, externalTarget: null, sortOrder: 4, visibilityRules: null },
  ],
};

// ──────────────────────────────────────────────────────
// TENANT 3: GreenBasket (organic grocery)
// ──────────────────────────────────────────────────────

const greenBasketSfId = id("sf_");
const greenBasketThemeId = id("thm_");
const greenBasketThemeVersionId = id("tv_");
const greenBasketTokenSetId = id("ts_");
const greenBasketSeoId = id("seo_");
const greenBasketNavId = id("nm_");

export const greenBasket = {
  storefront: {
    id: greenBasketSfId,
    tenantId: "green-basket",
    code: "green-basket-main",
    name: "GreenBasket",
    status: "active" as const,
    defaultLocale: "en",
    supportedLocales: ["en", "es"],
    primaryDomain: "www.greenbasket.co",
    seoDefaults: { title: "GreenBasket - Organic & Fresh", description: "Farm-fresh organic groceries delivered to your door" },
    featureFlags: { subscriptions: true, mealPlanner: true, localFarm: true },
    createdAt: now,
    updatedAt: now,
  },

  domainMappings: [
    { id: id("dm_"), storefrontId: greenBasketSfId, hostname: "www.greenbasket.co", isPrimary: true, redirectBehavior: "none" as const, sslStatus: "active" as const, verificationStatus: "verified" as const, createdAt: now, updatedAt: now },
  ],

  theme: {
    id: greenBasketThemeId,
    storefrontId: greenBasketSfId,
    code: "fresh-green",
    name: "Fresh Green",
    status: "active" as const,
    createdAt: now,
    updatedAt: now,
  },

  themeVersion: {
    id: greenBasketThemeVersionId,
    themeId: greenBasketThemeId,
    version: "1.0.0",
    state: "published" as const,
    baseThemeRef: null,
    description: "Fresh green palette evoking organic produce and nature",
    createdBy: "admin",
    publishedBy: "admin",
    createdAt: now,
    publishedAt: now,
  },

  tokenSets: [
    { id: greenBasketTokenSetId, themeVersionId: greenBasketThemeVersionId, mode: "default" as const, status: "active" as const, createdAt: now, updatedAt: now },
  ],

  tokens: [
    { group: "color", name: "primary-500", value: "#22C55E", type: "color" },
    { group: "color", name: "primary-600", value: "#16A34A", type: "color" },
    { group: "color", name: "secondary-500", value: "#F59E0B", type: "color" },
    { group: "color", name: "surface-background", value: "#F0FDF4", type: "color" },
    { group: "color", name: "surface-foreground", value: "#14532D", type: "color" },
    { group: "color", name: "surface-card", value: "#FFFFFF", type: "color" },
    { group: "color", name: "surface-muted", value: "#DCFCE7", type: "color" },
    { group: "color", name: "text-primary", value: "#14532D", type: "color" },
    { group: "color", name: "text-secondary", value: "#166534", type: "color" },
    { group: "color", name: "text-on-primary", value: "#FFFFFF", type: "color" },
    { group: "color", name: "border-default", value: "#BBF7D0", type: "color" },
    { group: "color", name: "error", value: "#DC2626", type: "color" },
    { group: "color", name: "success", value: "#059669", type: "color" },
    { group: "color", name: "warning", value: "#D97706", type: "color" },
    { group: "font", name: "family-heading", value: "'Nunito', sans-serif", type: "fontFamily" },
    { group: "font", name: "family-body", value: "'Open Sans', sans-serif", type: "fontFamily" },
    { group: "spacing", name: "xs", value: "0.25rem", type: "dimension" },
    { group: "spacing", name: "sm", value: "0.5rem", type: "dimension" },
    { group: "spacing", name: "md", value: "1rem", type: "dimension" },
    { group: "spacing", name: "lg", value: "1.5rem", type: "dimension" },
    { group: "spacing", name: "xl", value: "2rem", type: "dimension" },
    { group: "radius", name: "sm", value: "0.5rem", type: "dimension" },
    { group: "radius", name: "md", value: "0.75rem", type: "dimension" },
    { group: "radius", name: "lg", value: "1rem", type: "dimension" },
  ].map((t) => ({ id: id("tk_"), tokenSetId: greenBasketTokenSetId, ...t, reference: null, metadata: {}, createdAt: now, updatedAt: now })),

  seoProfiles: [
    { id: greenBasketSeoId, storefrontId: greenBasketSfId, code: "default", titleTemplate: "{pageTitle} | GreenBasket", descriptionTemplate: "{pageTitle} - Fresh organic groceries from GreenBasket", robots: "index, follow", canonicalStrategy: "path-based", structuredDataConfig: { "@type": "Organization", name: "GreenBasket" }, socialMeta: {}, createdAt: now, updatedAt: now },
  ],

  navigationMenus: [
    { id: greenBasketNavId, storefrontId: greenBasketSfId, code: "main-nav", name: "Main Navigation", locale: "en", state: "published" as const, createdAt: now, updatedAt: now },
  ],

  navigationItems: [
    { id: id("ni_"), navigationMenuId: greenBasketNavId, parentItemId: null, label: "Fresh Produce", itemType: "link" as const, href: "/collections/fresh-produce", pageRef: null, externalTarget: null, sortOrder: 0, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: greenBasketNavId, parentItemId: null, label: "Dairy & Eggs", itemType: "link" as const, href: "/collections/dairy-eggs", pageRef: null, externalTarget: null, sortOrder: 1, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: greenBasketNavId, parentItemId: null, label: "Pantry", itemType: "link" as const, href: "/collections/pantry", pageRef: null, externalTarget: null, sortOrder: 2, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: greenBasketNavId, parentItemId: null, label: "Meal Kits", itemType: "link" as const, href: "/meal-kits", pageRef: null, externalTarget: null, sortOrder: 3, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: greenBasketNavId, parentItemId: null, label: "Local Farms", itemType: "link" as const, href: "/local-farms", pageRef: null, externalTarget: null, sortOrder: 4, visibilityRules: null },
  ],
};

// ──────────────────────────────────────────────────────
// TENANT 4: AtelierOne (luxury fashion)
// ──────────────────────────────────────────────────────

const atelierOneSfId = id("sf_");
const atelierOneThemeId = id("thm_");
const atelierOneThemeVersionId = id("tv_");
const atelierOneTokenSetId = id("ts_");
const atelierOneSeoId = id("seo_");
const atelierOneNavId = id("nm_");

export const atelierOne = {
  storefront: {
    id: atelierOneSfId,
    tenantId: "atelier-one",
    code: "atelier-one-main",
    name: "AtelierOne",
    status: "active" as const,
    defaultLocale: "en",
    supportedLocales: ["en", "fr", "it", "zh"],
    primaryDomain: "www.atelierone.com",
    seoDefaults: { title: "AtelierOne - Luxury Fashion", description: "Exclusive luxury fashion and accessories from the world's finest designers" },
    featureFlags: { vipAccess: true, appointmentBooking: true, virtualTryOn: true, concierge: true },
    createdAt: now,
    updatedAt: now,
  },

  domainMappings: [
    { id: id("dm_"), storefrontId: atelierOneSfId, hostname: "www.atelierone.com", isPrimary: true, redirectBehavior: "none" as const, sslStatus: "active" as const, verificationStatus: "verified" as const, createdAt: now, updatedAt: now },
    { id: id("dm_"), storefrontId: atelierOneSfId, hostname: "atelierone.com", isPrimary: false, redirectBehavior: "permanent" as const, sslStatus: "active" as const, verificationStatus: "verified" as const, createdAt: now, updatedAt: now },
    { id: id("dm_"), storefrontId: atelierOneSfId, hostname: "fr.atelierone.com", isPrimary: false, redirectBehavior: "none" as const, sslStatus: "active" as const, verificationStatus: "verified" as const, createdAt: now, updatedAt: now },
  ],

  theme: {
    id: atelierOneThemeId,
    storefrontId: atelierOneSfId,
    code: "atelier-noir",
    name: "Atelier Noir",
    status: "active" as const,
    createdAt: now,
    updatedAt: now,
  },

  themeVersion: {
    id: atelierOneThemeVersionId,
    themeId: atelierOneThemeId,
    version: "1.0.0",
    state: "published" as const,
    baseThemeRef: null,
    description: "Sophisticated monochrome with gold accents for luxury fashion",
    createdBy: "admin",
    publishedBy: "admin",
    createdAt: now,
    publishedAt: now,
  },

  tokenSets: [
    { id: atelierOneTokenSetId, themeVersionId: atelierOneThemeVersionId, mode: "default" as const, status: "active" as const, createdAt: now, updatedAt: now },
  ],

  tokens: [
    { group: "color", name: "primary-500", value: "#B8860B", type: "color" },
    { group: "color", name: "primary-600", value: "#996F0A", type: "color" },
    { group: "color", name: "secondary-500", value: "#1A1A1A", type: "color" },
    { group: "color", name: "surface-background", value: "#FAFAFA", type: "color" },
    { group: "color", name: "surface-foreground", value: "#1A1A1A", type: "color" },
    { group: "color", name: "surface-card", value: "#FFFFFF", type: "color" },
    { group: "color", name: "surface-muted", value: "#F5F5F5", type: "color" },
    { group: "color", name: "text-primary", value: "#1A1A1A", type: "color" },
    { group: "color", name: "text-secondary", value: "#666666", type: "color" },
    { group: "color", name: "text-on-primary", value: "#FFFFFF", type: "color" },
    { group: "color", name: "border-default", value: "#E5E5E5", type: "color" },
    { group: "color", name: "error", value: "#991B1B", type: "color" },
    { group: "color", name: "success", value: "#166534", type: "color" },
    { group: "color", name: "warning", value: "#92400E", type: "color" },
    { group: "font", name: "family-heading", value: "'Cormorant Garamond', serif", type: "fontFamily" },
    { group: "font", name: "family-body", value: "'Montserrat', sans-serif", type: "fontFamily" },
    { group: "spacing", name: "xs", value: "0.25rem", type: "dimension" },
    { group: "spacing", name: "sm", value: "0.5rem", type: "dimension" },
    { group: "spacing", name: "md", value: "1rem", type: "dimension" },
    { group: "spacing", name: "lg", value: "2rem", type: "dimension" },
    { group: "spacing", name: "xl", value: "3rem", type: "dimension" },
    { group: "radius", name: "sm", value: "0", type: "dimension" },
    { group: "radius", name: "md", value: "0.125rem", type: "dimension" },
    { group: "radius", name: "lg", value: "0.25rem", type: "dimension" },
  ].map((t) => ({ id: id("tk_"), tokenSetId: atelierOneTokenSetId, ...t, reference: null, metadata: {}, createdAt: now, updatedAt: now })),

  seoProfiles: [
    { id: atelierOneSeoId, storefrontId: atelierOneSfId, code: "default", titleTemplate: "{pageTitle} — AtelierOne", descriptionTemplate: "{pageTitle} - Exclusive luxury fashion at AtelierOne", robots: "index, follow", canonicalStrategy: "domain-based", structuredDataConfig: { "@type": "Organization", name: "AtelierOne", brand: { "@type": "Brand", name: "AtelierOne" } }, socialMeta: { ogSiteName: "AtelierOne" }, createdAt: now, updatedAt: now },
  ],

  navigationMenus: [
    { id: atelierOneNavId, storefrontId: atelierOneSfId, code: "main-nav", name: "Main Navigation", locale: "en", state: "published" as const, createdAt: now, updatedAt: now },
  ],

  navigationItems: [
    { id: id("ni_"), navigationMenuId: atelierOneNavId, parentItemId: null, label: "Women", itemType: "link" as const, href: "/collections/women", pageRef: null, externalTarget: null, sortOrder: 0, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: atelierOneNavId, parentItemId: null, label: "Men", itemType: "link" as const, href: "/collections/men", pageRef: null, externalTarget: null, sortOrder: 1, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: atelierOneNavId, parentItemId: null, label: "Accessories", itemType: "link" as const, href: "/collections/accessories", pageRef: null, externalTarget: null, sortOrder: 2, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: atelierOneNavId, parentItemId: null, label: "New Arrivals", itemType: "link" as const, href: "/new-arrivals", pageRef: null, externalTarget: null, sortOrder: 3, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: atelierOneNavId, parentItemId: null, label: "Runway", itemType: "link" as const, href: "/runway", pageRef: null, externalTarget: null, sortOrder: 4, visibilityRules: null },
    { id: id("ni_"), navigationMenuId: atelierOneNavId, parentItemId: null, label: "Le Journal", itemType: "link" as const, href: "/journal", pageRef: null, externalTarget: null, sortOrder: 5, visibilityRules: null },
  ],
};

// ──────────────────────────────────────────────────────
// ALL TENANTS
// ──────────────────────────────────────────────────────

export const allTenants = [urbanNest, voltCart, greenBasket, atelierOne];
export const allBlockDefinitions = blockDefinitions;
