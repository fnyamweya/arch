import type {
  SeoProfileRecord,
  PageDefinitionRecord,
  PageRouteRecord,
  StorefrontRecord,
} from "@arch/storefront-core";
import type { SeoMeta } from "@arch/storefront-core";

// ─── SEO Metadata Generation ───

export interface GeneratedSeoMeta {
  readonly title: string;
  readonly description: string;
  readonly robots: string;
  readonly canonicalUrl: string;
  readonly openGraph: {
    readonly title: string;
    readonly description: string;
    readonly url: string;
    readonly siteName: string;
    readonly image?: string;
    readonly type: string;
  };
  readonly twitter: {
    readonly card: string;
    readonly title: string;
    readonly description: string;
    readonly image?: string;
  };
  readonly alternateLinks: readonly { locale: string; href: string }[];
  readonly structuredData: Record<string, unknown>[];
}

interface SeoTemplateContext {
  readonly pageName?: string;
  readonly pageTitle?: string;
  readonly storefrontName?: string;
  readonly collectionName?: string;
  readonly productName?: string;
  readonly brandName?: string;
  readonly locale?: string;
  readonly [key: string]: string | undefined;
}

/**
 * Generates complete SEO metadata for a page.
 */
export function generateSeoMeta(options: {
  storefront: StorefrontRecord;
  page: PageDefinitionRecord;
  route: PageRouteRecord;
  seoProfile: SeoProfileRecord | null;
  pageSeo: SeoMeta | null;
  context: SeoTemplateContext;
  baseUrl: string;
  alternateLocales?: readonly string[];
}): GeneratedSeoMeta {
  const { storefront, page, route, seoProfile, pageSeo, context, baseUrl, alternateLocales } =
    options;

  const templateCtx: SeoTemplateContext = {
    ...context,
    storefrontName: storefront.name,
    pageName: page.name,
  };

  // Build title
  const titleTemplate = seoProfile?.titleTemplate ?? "{pageTitle} | {storefrontName}";
  const rawTitle = pageSeo?.title ?? context.pageTitle ?? page.name;
  const title = interpolateTemplate(titleTemplate, { ...templateCtx, pageTitle: rawTitle });

  // Build description
  const descTemplate = seoProfile?.descriptionTemplate ?? "{pageTitle}";
  const description = pageSeo?.description
    ? interpolateTemplate(descTemplate, { ...templateCtx, pageTitle: pageSeo.description })
    : interpolateTemplate(descTemplate, templateCtx);

  // Build canonical URL
  const canonicalUrl = pageSeo?.canonicalUrl ?? `${baseUrl}${route.pathPattern}`;

  // Robots
  const robots = pageSeo?.robots ?? seoProfile?.robots ?? "index, follow";

  // Alternate links for i18n
  const alternateLinks = (alternateLocales ?? []).map((locale) => ({
    locale,
    href: `${baseUrl}/${locale}${route.pathPattern}`,
  }));

  // Structured data
  const structuredData: Record<string, unknown>[] = [];

  // Add WebPage schema
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonicalUrl,
    inLanguage: route.locale,
  });

  // Merge profile structured data config
  if (seoProfile?.structuredDataConfig) {
    const config = seoProfile.structuredDataConfig;
    if (typeof config === "object" && !Array.isArray(config)) {
      structuredData.push(config);
    }
  }

  return {
    title,
    description,
    robots,
    canonicalUrl,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: storefront.name,
      image: pageSeo?.ogImage,
      type: page.pageType === "product-detail" ? "product" : "website",
    },
    twitter: {
      card: pageSeo?.twitterCard ?? "summary_large_image",
      title,
      description,
      image: pageSeo?.ogImage,
    },
    alternateLinks,
    structuredData,
  };
}

// ─── Sitemap Generation ───

export interface SitemapEntry {
  readonly loc: string;
  readonly lastmod?: string;
  readonly changefreq?: string;
  readonly priority?: number;
  readonly alternates?: readonly { locale: string; href: string }[];
}

export interface SitemapOptions {
  readonly baseUrl: string;
  readonly routes: readonly PageRouteRecord[];
  readonly supportedLocales: readonly string[];
  readonly defaultLocale: string;
  readonly lastModified?: string;
}

/**
 * Generates a sitemap XML string.
 */
export function generateSitemap(options: SitemapOptions): string {
  const { baseUrl, routes, supportedLocales, defaultLocale, lastModified } = options;

  const activeRoutes = routes.filter((r) => r.status === "active");
  const entries: SitemapEntry[] = [];

  for (const route of activeRoutes) {
    if (route.locale !== defaultLocale) continue; // Only index default locale routes as primary

    const alternates = supportedLocales
      .filter((l) => l !== defaultLocale)
      .map((locale) => ({
        locale,
        href: `${baseUrl}/${locale}${route.pathPattern}`,
      }));

    entries.push({
      loc: `${baseUrl}${route.pathPattern}`,
      lastmod: lastModified,
      changefreq: route.routeType === "static" ? "weekly" : "daily",
      priority: route.pathPattern === "/" ? 1.0 : 0.8,
      alternates,
    });
  }

  return renderSitemapXml(entries);
}

function renderSitemapXml(entries: readonly SitemapEntry[]): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  for (const entry of entries) {
    lines.push("  <url>");
    lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    if (entry.lastmod) lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
    if (entry.changefreq) lines.push(`    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`);
    if (entry.priority !== undefined) lines.push(`    <priority>${entry.priority}</priority>`);
    if (entry.alternates) {
      for (const alt of entry.alternates) {
        lines.push(
          `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.locale)}" href="${escapeXml(alt.href)}" />`,
        );
      }
    }
    lines.push("  </url>");
  }

  lines.push("</urlset>");
  return lines.join("\n");
}

// ─── Robots.txt Generation ───

export interface RobotsOptions {
  readonly baseUrl: string;
  readonly disallowPaths?: readonly string[];
  readonly allowPaths?: readonly string[];
  readonly crawlDelay?: number;
}

/**
 * Generates a robots.txt string.
 */
export function generateRobotsTxt(options: RobotsOptions): string {
  const lines: string[] = ["User-agent: *"];

  if (options.allowPaths) {
    for (const path of options.allowPaths) {
      lines.push(`Allow: ${path}`);
    }
  }

  if (options.disallowPaths) {
    for (const path of options.disallowPaths) {
      lines.push(`Disallow: ${path}`);
    }
  }

  if (options.crawlDelay) {
    lines.push(`Crawl-delay: ${options.crawlDelay}`);
  }

  lines.push("");
  lines.push(`Sitemap: ${options.baseUrl}/sitemap.xml`);
  lines.push("");

  return lines.join("\n");
}

// ─── HTML Meta Tag Generation ───

/**
 * Generates HTML meta tag strings for embedding in <head>.
 */
export function renderMetaTags(meta: GeneratedSeoMeta): string {
  const tags: string[] = [];

  tags.push(`<title>${escapeHtml(meta.title)}</title>`);
  tags.push(`<meta name="description" content="${escapeHtml(meta.description)}" />`);
  tags.push(`<meta name="robots" content="${escapeHtml(meta.robots)}" />`);
  tags.push(`<link rel="canonical" href="${escapeHtml(meta.canonicalUrl)}" />`);

  // Open Graph
  tags.push(`<meta property="og:title" content="${escapeHtml(meta.openGraph.title)}" />`);
  tags.push(`<meta property="og:description" content="${escapeHtml(meta.openGraph.description)}" />`);
  tags.push(`<meta property="og:url" content="${escapeHtml(meta.openGraph.url)}" />`);
  tags.push(`<meta property="og:site_name" content="${escapeHtml(meta.openGraph.siteName)}" />`);
  tags.push(`<meta property="og:type" content="${escapeHtml(meta.openGraph.type)}" />`);
  if (meta.openGraph.image) {
    tags.push(`<meta property="og:image" content="${escapeHtml(meta.openGraph.image)}" />`);
  }

  // Twitter
  tags.push(`<meta name="twitter:card" content="${escapeHtml(meta.twitter.card)}" />`);
  tags.push(`<meta name="twitter:title" content="${escapeHtml(meta.twitter.title)}" />`);
  tags.push(`<meta name="twitter:description" content="${escapeHtml(meta.twitter.description)}" />`);
  if (meta.twitter.image) {
    tags.push(`<meta name="twitter:image" content="${escapeHtml(meta.twitter.image)}" />`);
  }

  // Alternate links
  for (const link of meta.alternateLinks) {
    tags.push(`<link rel="alternate" hreflang="${escapeHtml(link.locale)}" href="${escapeHtml(link.href)}" />`);
  }

  // Structured data
  for (const data of meta.structuredData) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(data)}</script>`);
  }

  return tags.join("\n");
}

// ─── Helpers ───

function interpolateTemplate(template: string, context: SeoTemplateContext): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => context[key] ?? "");
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
