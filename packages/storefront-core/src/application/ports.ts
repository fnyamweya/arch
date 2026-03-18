import type {
  StorefrontRecord,
  DomainMappingRecord,
  StorefrontThemeRecord,
  ThemeVersionRecord,
  ThemeTokenSetRecord,
  ThemeTokenRecord,
  LayoutTemplateRecord,
  LayoutVersionRecord,
  LayoutSlotDefinitionRecord,
  PageDefinitionRecord,
  PageVersionRecord,
  PageRouteRecord,
  BlockDefinitionRecord,
  BlockVersionRecord,
  BlockInstanceRecord,
  SectionDefinitionRecord,
  SectionInstanceRecord,
  ContentEntryRecord,
  NavigationMenuRecord,
  NavigationMenuItemRecord,
  SeoProfileRecord,
  RedirectRuleRecord,
  PreviewSessionRecord,
  PublishJobRecord,
} from "../domain/aggregates";
import type { PublishState } from "../domain/types";

// ─── Storefront Repository ───

export interface StorefrontRepositoryPort {
  getById(id: string): Promise<StorefrontRecord | null>;
  getByCode(tenantId: string, code: string): Promise<StorefrontRecord | null>;
  listByTenant(tenantId: string): Promise<readonly StorefrontRecord[]>;
  save(record: StorefrontRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

// ─── Domain Mapping Repository ───

export interface DomainMappingRepositoryPort {
  getById(id: string): Promise<DomainMappingRecord | null>;
  getByHostname(hostname: string): Promise<DomainMappingRecord | null>;
  listByStorefront(storefrontId: string): Promise<readonly DomainMappingRecord[]>;
  save(record: DomainMappingRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

// ─── Theme Repository ───

export interface ThemeRepositoryPort {
  getById(id: string): Promise<StorefrontThemeRecord | null>;
  getByCode(storefrontId: string, code: string): Promise<StorefrontThemeRecord | null>;
  listByStorefront(storefrontId: string): Promise<readonly StorefrontThemeRecord[]>;
  save(record: StorefrontThemeRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ThemeVersionRepositoryPort {
  getById(id: string): Promise<ThemeVersionRecord | null>;
  getByThemeAndVersion(themeId: string, version: string): Promise<ThemeVersionRecord | null>;
  getPublished(themeId: string): Promise<ThemeVersionRecord | null>;
  listByTheme(themeId: string): Promise<readonly ThemeVersionRecord[]>;
  save(record: ThemeVersionRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ThemeTokenSetRepositoryPort {
  getById(id: string): Promise<ThemeTokenSetRecord | null>;
  listByThemeVersion(themeVersionId: string): Promise<readonly ThemeTokenSetRecord[]>;
  save(record: ThemeTokenSetRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ThemeTokenRepositoryPort {
  listByTokenSet(tokenSetId: string): Promise<readonly ThemeTokenRecord[]>;
  save(record: ThemeTokenRecord): Promise<void>;
  saveBatch(records: readonly ThemeTokenRecord[]): Promise<void>;
  deleteByTokenSet(tokenSetId: string): Promise<void>;
}

// ─── Layout Repository ───

export interface LayoutTemplateRepositoryPort {
  getById(id: string): Promise<LayoutTemplateRecord | null>;
  getByCode(storefrontId: string, code: string): Promise<LayoutTemplateRecord | null>;
  listByStorefront(storefrontId: string): Promise<readonly LayoutTemplateRecord[]>;
  save(record: LayoutTemplateRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface LayoutVersionRepositoryPort {
  getById(id: string): Promise<LayoutVersionRecord | null>;
  getPublished(layoutTemplateId: string): Promise<LayoutVersionRecord | null>;
  listByTemplate(layoutTemplateId: string): Promise<readonly LayoutVersionRecord[]>;
  save(record: LayoutVersionRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface LayoutSlotDefinitionRepositoryPort {
  listByLayoutVersion(layoutVersionId: string): Promise<readonly LayoutSlotDefinitionRecord[]>;
  save(record: LayoutSlotDefinitionRecord): Promise<void>;
  saveBatch(records: readonly LayoutSlotDefinitionRecord[]): Promise<void>;
  deleteByLayoutVersion(layoutVersionId: string): Promise<void>;
}

// ─── Page Repository ───

export interface PageDefinitionRepositoryPort {
  getById(id: string): Promise<PageDefinitionRecord | null>;
  getByCode(storefrontId: string, code: string): Promise<PageDefinitionRecord | null>;
  listByStorefront(storefrontId: string): Promise<readonly PageDefinitionRecord[]>;
  save(record: PageDefinitionRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface PageVersionRepositoryPort {
  getById(id: string): Promise<PageVersionRecord | null>;
  getPublished(pageDefinitionId: string, locale: string): Promise<PageVersionRecord | null>;
  listByPage(pageDefinitionId: string): Promise<readonly PageVersionRecord[]>;
  save(record: PageVersionRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface PageRouteRepositoryPort {
  getById(id: string): Promise<PageRouteRecord | null>;
  getByPath(storefrontId: string, path: string, locale: string): Promise<PageRouteRecord | null>;
  listByStorefront(storefrontId: string): Promise<readonly PageRouteRecord[]>;
  listByPage(pageDefinitionId: string): Promise<readonly PageRouteRecord[]>;
  save(record: PageRouteRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

// ─── Block Repository ───

export interface BlockDefinitionRepositoryPort {
  getById(id: string): Promise<BlockDefinitionRecord | null>;
  getByCode(code: string): Promise<BlockDefinitionRecord | null>;
  listAll(): Promise<readonly BlockDefinitionRecord[]>;
  listByCategory(category: string): Promise<readonly BlockDefinitionRecord[]>;
  save(record: BlockDefinitionRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface BlockVersionRepositoryPort {
  getById(id: string): Promise<BlockVersionRecord | null>;
  getPublished(blockDefinitionId: string): Promise<BlockVersionRecord | null>;
  listByBlock(blockDefinitionId: string): Promise<readonly BlockVersionRecord[]>;
  save(record: BlockVersionRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface BlockInstanceRepositoryPort {
  listByPageVersion(pageVersionId: string): Promise<readonly BlockInstanceRecord[]>;
  listBySlot(pageVersionId: string, slotKey: string): Promise<readonly BlockInstanceRecord[]>;
  save(record: BlockInstanceRecord): Promise<void>;
  saveBatch(records: readonly BlockInstanceRecord[]): Promise<void>;
  deleteByPageVersion(pageVersionId: string): Promise<void>;
}

// ─── Section Repository ───

export interface SectionDefinitionRepositoryPort {
  getById(id: string): Promise<SectionDefinitionRecord | null>;
  getByCode(code: string): Promise<SectionDefinitionRecord | null>;
  listByStorefront(storefrontId: string | null): Promise<readonly SectionDefinitionRecord[]>;
  save(record: SectionDefinitionRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface SectionInstanceRepositoryPort {
  listByPageVersion(pageVersionId: string): Promise<readonly SectionInstanceRecord[]>;
  save(record: SectionInstanceRecord): Promise<void>;
  saveBatch(records: readonly SectionInstanceRecord[]): Promise<void>;
  deleteByPageVersion(pageVersionId: string): Promise<void>;
}

// ─── Content Repository ───

export interface ContentEntryRepositoryPort {
  getById(id: string): Promise<ContentEntryRecord | null>;
  getByRef(
    storefrontId: string,
    contentType: string,
    code: string,
    locale: string,
  ): Promise<ContentEntryRecord | null>;
  listByStorefront(storefrontId: string): Promise<readonly ContentEntryRecord[]>;
  listByType(storefrontId: string, contentType: string): Promise<readonly ContentEntryRecord[]>;
  save(record: ContentEntryRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

// ─── Navigation Repository ───

export interface NavigationMenuRepositoryPort {
  getById(id: string): Promise<NavigationMenuRecord | null>;
  getByCode(storefrontId: string, code: string, locale: string): Promise<NavigationMenuRecord | null>;
  listByStorefront(storefrontId: string): Promise<readonly NavigationMenuRecord[]>;
  save(record: NavigationMenuRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface NavigationMenuItemRepositoryPort {
  listByMenu(menuId: string): Promise<readonly NavigationMenuItemRecord[]>;
  save(record: NavigationMenuItemRecord): Promise<void>;
  saveBatch(records: readonly NavigationMenuItemRecord[]): Promise<void>;
  deleteByMenu(menuId: string): Promise<void>;
}

// ─── SEO Repository ───

export interface SeoProfileRepositoryPort {
  getById(id: string): Promise<SeoProfileRecord | null>;
  getByCode(storefrontId: string, code: string): Promise<SeoProfileRecord | null>;
  listByStorefront(storefrontId: string): Promise<readonly SeoProfileRecord[]>;
  save(record: SeoProfileRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface RedirectRuleRepositoryPort {
  getById(id: string): Promise<RedirectRuleRecord | null>;
  getBySourcePath(storefrontId: string, sourcePath: string): Promise<RedirectRuleRecord | null>;
  listByStorefront(storefrontId: string): Promise<readonly RedirectRuleRecord[]>;
  save(record: RedirectRuleRecord): Promise<void>;
  delete(id: string): Promise<void>;
}

// ─── Preview & Publish Repositories ───

export interface PreviewSessionRepositoryPort {
  getById(id: string): Promise<PreviewSessionRecord | null>;
  getByTokenHash(tokenHash: string): Promise<PreviewSessionRecord | null>;
  listByStorefront(storefrontId: string): Promise<readonly PreviewSessionRecord[]>;
  save(record: PreviewSessionRecord): Promise<void>;
  revoke(id: string, revokedAt: string): Promise<void>;
}

export interface PublishJobRepositoryPort {
  getById(id: string): Promise<PublishJobRecord | null>;
  listByStorefront(storefrontId: string): Promise<readonly PublishJobRecord[]>;
  listPending(): Promise<readonly PublishJobRecord[]>;
  save(record: PublishJobRecord): Promise<void>;
}

// ─── Resolved page for delivery ───

export interface ResolvedPage {
  readonly storefront: StorefrontRecord;
  readonly page: PageDefinitionRecord;
  readonly pageVersion: PageVersionRecord;
  readonly route: PageRouteRecord;
  readonly layoutVersion: LayoutVersionRecord;
  readonly slots: readonly LayoutSlotDefinitionRecord[];
  readonly blocks: readonly BlockInstanceRecord[];
  readonly blockVersions: ReadonlyMap<string, BlockVersionRecord>;
  readonly theme: StorefrontThemeRecord;
  readonly themeVersion: ThemeVersionRecord;
  readonly tokenSets: readonly ThemeTokenSetRecord[];
  readonly tokens: ReadonlyMap<string, readonly ThemeTokenRecord[]>;
  readonly seoProfile: SeoProfileRecord | null;
  readonly navigation: ReadonlyMap<string, NavigationMenuRecord & { items: readonly NavigationMenuItemRecord[] }>;
}

// ─── Page resolver service port ───

export interface PageResolverPort {
  resolve(
    storefrontId: string,
    path: string,
    locale: string,
    previewToken?: string,
  ): Promise<ResolvedPage | null>;
}

// ─── Publish state transition queries ───

export interface VersionStateQuery {
  getState(targetType: string, targetId: string): Promise<PublishState>;
  getPublishedVersionId(targetType: string, targetId: string): Promise<string | null>;
}
