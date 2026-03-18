import type {
  StorefrontRecord,
  DomainMappingRecord,
  PageRouteRecord,
  RedirectRuleRecord,
} from "@arch/storefront-core";

// ─── Domain Resolution ───

export interface DomainResolutionResult {
  readonly storefront: StorefrontRecord;
  readonly domainMapping: DomainMappingRecord;
  readonly shouldRedirect: boolean;
  readonly redirectTarget: string | null;
}

/**
 * Resolves a hostname to a storefront via domain mappings.
 */
export function resolveDomain(
  hostname: string,
  mappings: readonly DomainMappingRecord[],
  storefronts: ReadonlyMap<string, StorefrontRecord>,
): DomainResolutionResult | null {
  const mapping = mappings.find(
    (m) => m.hostname.toLowerCase() === hostname.toLowerCase(),
  );
  if (!mapping) return null;

  const storefront = storefronts.get(mapping.storefrontId);
  if (!storefront) return null;
  if (storefront.status !== "active") return null;

  // If not primary, check redirect behavior
  if (!mapping.isPrimary && mapping.redirectBehavior !== "none") {
    const primaryMapping = mappings.find(
      (m) => m.storefrontId === mapping.storefrontId && m.isPrimary,
    );
    if (primaryMapping) {
      return {
        storefront,
        domainMapping: mapping,
        shouldRedirect: true,
        redirectTarget: primaryMapping.hostname,
      };
    }
  }

  return {
    storefront,
    domainMapping: mapping,
    shouldRedirect: false,
    redirectTarget: null,
  };
}

// ─── Route Matching ───

export interface RouteMatch {
  readonly route: PageRouteRecord;
  readonly params: Readonly<Record<string, string>>;
  readonly isExact: boolean;
}

/**
 * Matches a URL path against storefront routes.
 * Supports static, dynamic (:param), pattern, and catch-all routes.
 */
export function matchRoute(
  path: string,
  routes: readonly PageRouteRecord[],
  locale: string,
): RouteMatch | null {
  const normalizedPath = normalizePath(path);

  // Priority: exact static > dynamic > pattern > catch-all
  const activeRoutes = routes.filter((r) => r.status === "active");

  // 1. Exact static match
  for (const route of activeRoutes) {
    if (route.routeType === "static" && route.locale === locale) {
      if (normalizePath(route.pathPattern) === normalizedPath) {
        return { route, params: {}, isExact: true };
      }
    }
  }

  // 2. Dynamic parameter match
  for (const route of activeRoutes) {
    if (route.routeType === "dynamic" && route.locale === locale) {
      const params = matchDynamicRoute(normalizedPath, route.pathPattern);
      if (params) {
        return { route, params, isExact: false };
      }
    }
  }

  // 3. Pattern match
  for (const route of activeRoutes) {
    if (route.routeType === "pattern" && route.locale === locale) {
      const params = matchPatternRoute(normalizedPath, route.pathPattern);
      if (params) {
        return { route, params, isExact: false };
      }
    }
  }

  // 4. Catch-all
  for (const route of activeRoutes) {
    if (route.routeType === "catch-all" && route.locale === locale) {
      return {
        route,
        params: { "*": normalizedPath.substring(1) },
        isExact: false,
      };
    }
  }

  // Try locale fallback - strip region from locale
  const baseLang = locale.split("-")[0]!;
  if (baseLang !== locale) {
    return matchRoute(path, routes, baseLang);
  }

  return null;
}

// ─── Redirect Resolution ───

export interface RedirectMatch {
  readonly rule: RedirectRuleRecord;
  readonly destinationPath: string;
}

/**
 * Checks if a path matches any redirect rules.
 */
export function matchRedirect(
  path: string,
  rules: readonly RedirectRuleRecord[],
): RedirectMatch | null {
  const normalizedPath = normalizePath(path);

  for (const rule of rules) {
    if (!rule.active) continue;

    if (normalizePath(rule.sourcePath) === normalizedPath) {
      return { rule, destinationPath: rule.destinationPath };
    }
  }

  return null;
}

// ─── Locale Resolution ───

export interface LocaleResolution {
  readonly locale: string;
  readonly source: "path" | "header" | "cookie" | "default";
}

/**
 * Resolves the locale from various sources.
 */
export function resolveLocale(
  path: string,
  acceptLanguage: string | null,
  cookieLocale: string | null,
  supportedLocales: readonly string[],
  defaultLocale: string,
): LocaleResolution {
  if (supportedLocales.length === 0) {
    return { locale: defaultLocale, source: "default" };
  }

  const supportedSet = new Set(supportedLocales);

  // 1. Check path prefix (e.g. /en-US/products)
  const pathMatch = path.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);
  if (pathMatch && supportedSet.has(pathMatch[1]!)) {
    return { locale: pathMatch[1]!, source: "path" };
  }

  // 2. Check cookie
  if (cookieLocale && supportedSet.has(cookieLocale)) {
    return { locale: cookieLocale, source: "cookie" };
  }

  // 3. Check Accept-Language header
  if (acceptLanguage) {
    const parsed = parseAcceptLanguage(acceptLanguage);
    for (const lang of parsed) {
      if (supportedSet.has(lang)) {
        return { locale: lang, source: "header" };
      }
      // Try base language
      const base = lang.split("-")[0]!;
      if (supportedSet.has(base)) {
        return { locale: base, source: "header" };
      }
    }
  }

  return { locale: defaultLocale, source: "default" };
}

// ─── URL Generation ───

/**
 * Generates a URL path from a route pattern and params.
 */
export function generatePath(
  pattern: string,
  params: Readonly<Record<string, string>>,
): string {
  let path = pattern;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, encodeURIComponent(value));
  }
  return path;
}

/**
 * Strips the locale prefix from a path if present.
 */
export function stripLocalePrefix(
  path: string,
  supportedLocales: readonly string[],
): { path: string; locale: string | null } {
  for (const locale of supportedLocales) {
    const prefix = `/${locale}/`;
    if (path.startsWith(prefix)) {
      return { path: `/${path.substring(prefix.length)}`, locale };
    }
    if (path === `/${locale}`) {
      return { path: "/", locale };
    }
  }
  return { path, locale: null };
}

// ─── Internal Helpers ───

function normalizePath(path: string): string {
  let normalized = path.toLowerCase();
  // Remove trailing slash except for root
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

function matchDynamicRoute(
  path: string,
  pattern: string,
): Record<string, string> | null {
  const pathSegments = path.split("/").filter(Boolean);
  const patternSegments = normalizePath(pattern).split("/").filter(Boolean);

  if (pathSegments.length !== patternSegments.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const patSeg = patternSegments[i]!;
    const pathSeg = pathSegments[i]!;

    if (patSeg.startsWith(":")) {
      params[patSeg.substring(1)] = pathSeg;
    } else if (patSeg !== pathSeg) {
      return null;
    }
  }

  return params;
}

function matchPatternRoute(
  path: string,
  pattern: string,
): Record<string, string> | null {
  // Convert pattern to regex: :param becomes named capture group
  let regexStr = normalizePath(pattern)
    .replace(/:[a-zA-Z]+/g, (match) => `(?<${match.substring(1)}>[^/]+)`)
    .replace(/\*/g, "(?<wildcard>.*)");

  regexStr = `^${regexStr}$`;

  try {
    const regex = new RegExp(regexStr);
    const match = normalizePath(path).match(regex);
    if (!match) return null;
    return { ...match.groups } as Record<string, string>;
  } catch {
    return null;
  }
}

function parseAcceptLanguage(header: string): string[] {
  return header
    .split(",")
    .map((part) => {
      const [lang, qPart] = part.trim().split(";");
      const q = qPart ? Number.parseFloat(qPart.replace("q=", "")) : 1;
      return { lang: lang!.trim(), q };
    })
    .sort((a, b) => b.q - a.q)
    .map((x) => x.lang);
}
