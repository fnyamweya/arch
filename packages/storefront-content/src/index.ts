import type {
  ContentEntryRecord,
  NavigationMenuRecord,
  NavigationMenuItemRecord,
} from "@arch/storefront-core";
import { MAX_NAVIGATION_DEPTH } from "@arch/storefront-core";

// ─── Content Entry Resolution ───

export interface ResolvedContent {
  readonly contentType: string;
  readonly code: string;
  readonly locale: string;
  readonly data: Record<string, unknown>;
  readonly isScheduled: boolean;
  readonly isActive: boolean;
}

/**
 * Resolves a content entry into a renderable form, checking schedule windows.
 */
export function resolveContentEntry(
  entry: ContentEntryRecord,
  now: Date = new Date(),
): ResolvedContent {
  const nowIso = now.toISOString();

  const isScheduled = !!(entry.scheduleStart || entry.scheduleEnd);
  let isActive = entry.state === "published";

  if (isActive && isScheduled) {
    if (entry.scheduleStart && nowIso < entry.scheduleStart) {
      isActive = false;
    }
    if (entry.scheduleEnd && nowIso > entry.scheduleEnd) {
      isActive = false;
    }
  }

  return {
    contentType: entry.contentType,
    code: entry.code,
    locale: entry.locale,
    data: entry.data,
    isScheduled,
    isActive,
  };
}

// ─── Content Localization ───

export interface LocalizedContentResult {
  readonly entry: ContentEntryRecord | null;
  readonly fallbackUsed: boolean;
  readonly locale: string;
}

/**
 * Finds the best matching content entry for a locale with fallback.
 */
export function resolveLocalizedContent(
  entries: readonly ContentEntryRecord[],
  targetLocale: string,
  defaultLocale: string,
): LocalizedContentResult {
  // Exact match
  const exact = entries.find((e) => e.locale === targetLocale && e.state === "published");
  if (exact) {
    return { entry: exact, fallbackUsed: false, locale: targetLocale };
  }

  // Try base locale (e.g. "en" from "en-US")
  const baseLang = targetLocale.split("-")[0]!;
  if (baseLang !== targetLocale) {
    const baseFallback = entries.find((e) => e.locale === baseLang && e.state === "published");
    if (baseFallback) {
      return { entry: baseFallback, fallbackUsed: true, locale: baseLang };
    }
  }

  // Default locale fallback
  if (targetLocale !== defaultLocale) {
    const defaultFallback = entries.find(
      (e) => e.locale === defaultLocale && e.state === "published",
    );
    if (defaultFallback) {
      return { entry: defaultFallback, fallbackUsed: true, locale: defaultLocale };
    }
  }

  return { entry: null, fallbackUsed: false, locale: targetLocale };
}

// ─── Navigation Tree Builder ───

export interface NavigationNode {
  readonly id: string;
  readonly label: string;
  readonly href: string | null;
  readonly itemType: string;
  readonly children: readonly NavigationNode[];
  readonly isExternal: boolean;
  readonly depth: number;
}

export interface NavigationTree {
  readonly menuCode: string;
  readonly locale: string;
  readonly items: readonly NavigationNode[];
  readonly totalItems: number;
}

/**
 * Builds a navigation tree from flat menu items.
 */
export function buildNavigationTree(
  menu: NavigationMenuRecord,
  items: readonly NavigationMenuItemRecord[],
): NavigationTree {
  const itemMap = new Map<string, NavigationMenuItemRecord[]>();
  const rootItems: NavigationMenuItemRecord[] = [];

  for (const item of items) {
    if (item.parentItemId) {
      const children = itemMap.get(item.parentItemId) ?? [];
      children.push(item);
      itemMap.set(item.parentItemId, children);
    } else {
      rootItems.push(item);
    }
  }

  // Sort by sortOrder
  rootItems.sort((a, b) => a.sortOrder - b.sortOrder);

  let totalItems = 0;

  function buildNode(item: NavigationMenuItemRecord, depth: number): NavigationNode {
    totalItems++;
    const children = (itemMap.get(item.id) ?? [])
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const childNodes =
      depth < MAX_NAVIGATION_DEPTH
        ? children.map((child) => buildNode(child, depth + 1))
        : [];

    return {
      id: item.id,
      label: item.label,
      href: item.href ?? item.pageRef ?? null,
      itemType: item.itemType,
      children: childNodes,
      isExternal: item.itemType === "external",
      depth,
    };
  }

  const treeItems = rootItems.map((item) => buildNode(item, 0));

  return {
    menuCode: menu.code,
    locale: menu.locale,
    items: treeItems,
    totalItems,
  };
}

// ─── Navigation Validation ───

export interface NavigationValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export function validateNavigation(
  items: readonly NavigationMenuItemRecord[],
): NavigationValidationResult {
  const errors: string[] = [];

  // Check for orphaned items
  const itemIds = new Set(items.map((i) => i.id));
  for (const item of items) {
    if (item.parentItemId && !itemIds.has(item.parentItemId)) {
      errors.push(`Navigation item "${item.label}" references non-existent parent "${item.parentItemId}"`);
    }
  }

  // Check depth
  const depthMap = new Map<string, number>();
  function getDepth(item: NavigationMenuItemRecord): number {
    if (depthMap.has(item.id)) return depthMap.get(item.id)!;
    if (!item.parentItemId) {
      depthMap.set(item.id, 0);
      return 0;
    }
    const parent = items.find((i) => i.id === item.parentItemId);
    if (!parent) return 0;
    const depth = getDepth(parent) + 1;
    depthMap.set(item.id, depth);
    return depth;
  }

  for (const item of items) {
    const depth = getDepth(item);
    if (depth > MAX_NAVIGATION_DEPTH) {
      errors.push(
        `Navigation item "${item.label}" exceeds maximum depth of ${MAX_NAVIGATION_DEPTH}`,
      );
    }
  }

  // Check link items have href
  for (const item of items) {
    if (item.itemType === "link" && !item.href) {
      errors.push(`Navigation item "${item.label}" of type "link" must have an href`);
    }
    if (item.itemType === "page-ref" && !item.pageRef) {
      errors.push(`Navigation item "${item.label}" of type "page-ref" must have a pageRef`);
    }
    if (item.itemType === "external" && !item.href) {
      errors.push(`Navigation item "${item.label}" of type "external" must have an href`);
    }
  }

  return { valid: errors.length === 0, errors };
}
