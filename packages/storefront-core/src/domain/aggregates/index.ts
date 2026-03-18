import type {
  StorefrontStatus,
  SeoMeta,
  SslStatus,
  VerificationStatus,
  RedirectBehavior,
  PublishState,
  ThemeMode,
  TokenSetStatus,
  TokenGroup,
  TokenType,
  PageType,
  RouteType,
  RouteStatus,
  BlockCategory,
  BlockStatus,
  HydrationStrategy,
  DeprecationStatus,
  CachePolicy,
  VisibilityRules,
  NavigationItemType,
  SectionStatus,
  ContentEntryState,
  RedirectHttpStatus,
  PreviewScopeType,
  PublishTargetType,
  PublishJobStatus,
} from "../types";

// ─── Storefront Aggregate ───

export interface StorefrontRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly code: string;
  readonly name: string;
  readonly status: StorefrontStatus;
  readonly defaultLocale: string;
  readonly supportedLocales: readonly string[];
  readonly primaryDomain: string | null;
  readonly seoDefaults: SeoMeta;
  readonly featureFlags: Record<string, boolean>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ─── Domain Mapping ───

export interface DomainMappingRecord {
  readonly id: string;
  readonly storefrontId: string;
  readonly hostname: string;
  readonly isPrimary: boolean;
  readonly redirectBehavior: RedirectBehavior;
  readonly sslStatus: SslStatus;
  readonly verificationStatus: VerificationStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ─── Theme Aggregate ───

export interface StorefrontThemeRecord {
  readonly id: string;
  readonly storefrontId: string;
  readonly code: string;
  readonly name: string;
  readonly status: StorefrontStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ThemeVersionRecord {
  readonly id: string;
  readonly themeId: string;
  readonly version: string;
  readonly state: PublishState;
  readonly baseThemeRef: string | null;
  readonly description: string;
  readonly createdBy: string;
  readonly publishedBy: string | null;
  readonly createdAt: string;
  readonly publishedAt: string | null;
}

export interface ThemeTokenSetRecord {
  readonly id: string;
  readonly themeVersionId: string;
  readonly mode: ThemeMode;
  readonly status: TokenSetStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ThemeTokenRecord {
  readonly id: string;
  readonly tokenSetId: string;
  readonly group: TokenGroup;
  readonly name: string;
  readonly value: string;
  readonly type: TokenType;
  readonly reference: string | null;
  readonly metadata: Record<string, unknown>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ─── Layout Aggregate ───

export interface LayoutTemplateRecord {
  readonly id: string;
  readonly storefrontId: string;
  readonly code: string;
  readonly name: string;
  readonly pageType: PageType;
  readonly description: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface LayoutVersionRecord {
  readonly id: string;
  readonly layoutTemplateId: string;
  readonly version: string;
  readonly state: PublishState;
  readonly schema: Record<string, unknown>;
  readonly createdBy: string;
  readonly publishedBy: string | null;
  readonly createdAt: string;
  readonly publishedAt: string | null;
}

export interface LayoutSlotDefinitionRecord {
  readonly id: string;
  readonly layoutVersionId: string;
  readonly slotKey: string;
  readonly displayName: string;
  readonly allowedBlockCategories: readonly BlockCategory[];
  readonly minBlocks: number;
  readonly maxBlocks: number;
  readonly required: boolean;
  readonly responsiveRules: Record<string, unknown>;
  readonly orderingRules: Record<string, unknown>;
}

// ─── Page Aggregate ───

export interface PageDefinitionRecord {
  readonly id: string;
  readonly storefrontId: string;
  readonly code: string;
  readonly pageType: PageType;
  readonly name: string;
  readonly seoProfileId: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PageVersionRecord {
  readonly id: string;
  readonly pageDefinitionId: string;
  readonly layoutVersionId: string;
  readonly version: string;
  readonly state: PublishState;
  readonly locale: string;
  readonly title: string;
  readonly description: string;
  readonly contentSchemaVersion: string;
  readonly createdBy: string;
  readonly publishedBy: string | null;
  readonly createdAt: string;
  readonly publishedAt: string | null;
}

export interface PageRouteRecord {
  readonly id: string;
  readonly storefrontId: string;
  readonly pageDefinitionId: string;
  readonly routeType: RouteType;
  readonly pathPattern: string;
  readonly locale: string;
  readonly status: RouteStatus;
  readonly canonicalRoute: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ─── Block Aggregate ───

export interface BlockDefinitionRecord {
  readonly id: string;
  readonly code: string;
  readonly category: BlockCategory;
  readonly displayName: string;
  readonly description: string;
  readonly icon: string;
  readonly status: BlockStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface BlockVersionRecord {
  readonly id: string;
  readonly blockDefinitionId: string;
  readonly version: string;
  readonly state: PublishState;
  readonly configSchema: Record<string, unknown>;
  readonly contentSchema: Record<string, unknown>;
  readonly defaultConfig: Record<string, unknown>;
  readonly defaultContent: Record<string, unknown>;
  readonly allowedPageTypes: readonly PageType[];
  readonly allowedSlots: readonly string[];
  readonly dataRequirements: Record<string, unknown>;
  readonly cachePolicy: CachePolicy;
  readonly seoPolicy: Record<string, unknown>;
  readonly hydrationStrategy: HydrationStrategy;
  readonly deprecationStatus: DeprecationStatus;
  readonly migrationStrategy: Record<string, unknown> | null;
  readonly createdAt: string;
  readonly publishedAt: string | null;
}

export interface BlockInstanceRecord {
  readonly id: string;
  readonly pageVersionId: string;
  readonly slotKey: string;
  readonly blockVersionId: string;
  readonly instanceKey: string;
  readonly sortOrder: number;
  readonly config: Record<string, unknown>;
  readonly contentRef: string | null;
  readonly visibilityRules: VisibilityRules | null;
  readonly experimentRef: string | null;
  readonly personalizationRules: Record<string, unknown> | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ─── Section Aggregate ───

export interface SectionDefinitionRecord {
  readonly id: string;
  readonly storefrontId: string | null;
  readonly code: string;
  readonly name: string;
  readonly allowedPageTypes: readonly PageType[];
  readonly compositionSchema: Record<string, unknown>;
  readonly status: SectionStatus;
}

export interface SectionInstanceRecord {
  readonly id: string;
  readonly pageVersionId: string;
  readonly sectionDefinitionId: string;
  readonly slotKey: string;
  readonly sortOrder: number;
  readonly sectionConfig: Record<string, unknown>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ─── Content Aggregate ───

export interface ContentEntryRecord {
  readonly id: string;
  readonly storefrontId: string;
  readonly contentType: string;
  readonly code: string;
  readonly locale: string;
  readonly state: ContentEntryState;
  readonly schema: Record<string, unknown>;
  readonly data: Record<string, unknown>;
  readonly scheduleStart: string | null;
  readonly scheduleEnd: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ─── Navigation Aggregate ───

export interface NavigationMenuRecord {
  readonly id: string;
  readonly storefrontId: string;
  readonly code: string;
  readonly name: string;
  readonly locale: string;
  readonly state: PublishState;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface NavigationMenuItemRecord {
  readonly id: string;
  readonly navigationMenuId: string;
  readonly parentItemId: string | null;
  readonly label: string;
  readonly itemType: NavigationItemType;
  readonly href: string | null;
  readonly pageRef: string | null;
  readonly externalTarget: string | null;
  readonly sortOrder: number;
  readonly visibilityRules: VisibilityRules | null;
}

// ─── SEO Aggregate ───

export interface SeoProfileRecord {
  readonly id: string;
  readonly storefrontId: string;
  readonly code: string;
  readonly titleTemplate: string;
  readonly descriptionTemplate: string;
  readonly robots: string;
  readonly canonicalStrategy: string;
  readonly structuredDataConfig: Record<string, unknown>;
  readonly socialMeta: Record<string, unknown>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface RedirectRuleRecord {
  readonly id: string;
  readonly storefrontId: string;
  readonly sourcePath: string;
  readonly destinationPath: string;
  readonly httpStatus: RedirectHttpStatus;
  readonly active: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ─── Preview & Publish Aggregates ───

export interface PreviewSessionRecord {
  readonly id: string;
  readonly storefrontId: string;
  readonly actorId: string;
  readonly scopeType: PreviewScopeType;
  readonly scopeId: string;
  readonly tokenHash: string;
  readonly expiresAt: string;
  readonly revokedAt: string | null;
  readonly createdAt: string;
}

export interface PublishJobRecord {
  readonly id: string;
  readonly storefrontId: string;
  readonly targetType: PublishTargetType;
  readonly targetId: string;
  readonly sourceVersion: string;
  readonly targetVersion: string;
  readonly status: PublishJobStatus;
  readonly validationReport: Record<string, unknown>;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly completedAt: string | null;
}
