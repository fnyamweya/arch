import type {
  StorefrontRecord,
  StorefrontRepositoryPort,
  DomainMappingRepositoryPort,
  ThemeRepositoryPort,
  ThemeVersionRepositoryPort,
  ThemeTokenSetRepositoryPort,
  ThemeTokenRepositoryPort,
  LayoutTemplateRepositoryPort,
  LayoutVersionRepositoryPort,
  LayoutSlotDefinitionRepositoryPort,
  PageDefinitionRepositoryPort,
  PageVersionRepositoryPort,
  PageRouteRepositoryPort,
  BlockDefinitionRepositoryPort,
  BlockVersionRepositoryPort,
  BlockInstanceRepositoryPort,
  ContentEntryRepositoryPort,
  NavigationMenuRepositoryPort,
  NavigationMenuItemRepositoryPort,
  SeoProfileRepositoryPort,
  RedirectRuleRepositoryPort,
  PreviewSessionRepositoryPort,
  PublishJobRepositoryPort,
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
  ContentEntryRecord,
  NavigationMenuRecord,
  NavigationMenuItemRecord,
  SeoProfileRecord,
  RedirectRuleRecord,
  PreviewSessionRecord,
  PublishJobRecord,
} from "@arch/storefront-core";
import { canTransitionTo, MAX_PREVIEW_SESSION_TTL_SECONDS, DEFAULT_PREVIEW_SESSION_TTL_SECONDS } from "@arch/storefront-core";
import type { PublishState } from "@arch/storefront-core";
import { lintThemeTokens, compileTokenSet } from "@arch/storefront-theme";
import type { ThemeLintResult } from "@arch/storefront-theme";
import { validateSlotAssignment } from "@arch/storefront-layout";

// ─── ID Generation ───

function generateId(prefix: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = prefix;
  for (let i = 0; i < 24; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function nowIso(): string {
  return new Date().toISOString();
}

interface DigestAlgorithm {
  readonly digest: (algorithm: "SHA-256", data: Uint8Array) => Promise<ArrayBuffer>;
}

interface CryptoLike {
  readonly subtle?: DigestAlgorithm;
}

const redirectStatuses = new Set<RedirectRuleRecord["httpStatus"]>([301, 302, 307, 308]);

function normalizeRedirectHttpStatus(httpStatus?: string): RedirectRuleRecord["httpStatus"] {
  if (httpStatus === undefined) {
    return 301;
  }

  const parsedStatus = Number(httpStatus);
  if (!Number.isInteger(parsedStatus) || !redirectStatuses.has(parsedStatus as RedirectRuleRecord["httpStatus"])) {
    throw new Error(`Unsupported redirect HTTP status "${httpStatus}"`);
  }

  return parsedStatus as RedirectRuleRecord["httpStatus"];
}

// ─── Storefront Admin Service ───

export class StorefrontAdminService {
  constructor(
    private readonly storefrontRepo: StorefrontRepositoryPort,
    private readonly domainMappingRepo: DomainMappingRepositoryPort,
  ) { }

  async createStorefront(input: {
    tenantId: string;
    code: string;
    name: string;
    defaultLocale: string;
    supportedLocales: readonly string[];
    seoDefaults?: Record<string, unknown>;
    featureFlags?: Record<string, boolean>;
  }): Promise<StorefrontRecord> {
    const existing = await this.storefrontRepo.getByCode(input.tenantId, input.code);
    if (existing) {
      throw new Error(`Storefront with code "${input.code}" already exists`);
    }

    const record: StorefrontRecord = {
      id: generateId("sf_"),
      tenantId: input.tenantId,
      code: input.code,
      name: input.name,
      status: "active",
      defaultLocale: input.defaultLocale,
      supportedLocales: input.supportedLocales,
      primaryDomain: null,
      seoDefaults: (input.seoDefaults ?? {}) as StorefrontRecord["seoDefaults"],
      featureFlags: input.featureFlags ?? {},
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    await this.storefrontRepo.save(record);
    return record;
  }

  async updateStorefront(
    id: string,
    input: Partial<Pick<StorefrontRecord, "name" | "status" | "defaultLocale" | "supportedLocales" | "seoDefaults" | "featureFlags">>,
  ): Promise<StorefrontRecord> {
    const existing = await this.storefrontRepo.getById(id);
    if (!existing) throw new Error(`Storefront "${id}" not found`);

    const updated: StorefrontRecord = {
      ...existing,
      ...input,
      updatedAt: nowIso(),
    };
    await this.storefrontRepo.save(updated);
    return updated;
  }

  async getStorefront(id: string): Promise<StorefrontRecord | null> {
    return this.storefrontRepo.getById(id);
  }

  async listStorefronts(tenantId: string): Promise<readonly StorefrontRecord[]> {
    return this.storefrontRepo.listByTenant(tenantId);
  }

  async deleteStorefront(id: string): Promise<void> {
    await this.storefrontRepo.delete(id);
  }

  // Domain Mappings
  async addDomainMapping(input: {
    storefrontId: string;
    hostname: string;
    isPrimary?: boolean;
    redirectBehavior?: string;
  }): Promise<DomainMappingRecord> {
    const existing = await this.domainMappingRepo.getByHostname(input.hostname);
    if (existing) throw new Error(`Domain "${input.hostname}" is already mapped`);

    const record: DomainMappingRecord = {
      id: generateId("dm_"),
      storefrontId: input.storefrontId,
      hostname: input.hostname,
      isPrimary: input.isPrimary ?? false,
      redirectBehavior: (input.redirectBehavior ?? "none") as DomainMappingRecord["redirectBehavior"],
      sslStatus: "pending",
      verificationStatus: "pending",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    await this.domainMappingRepo.save(record);
    return record;
  }

  async listDomainMappings(storefrontId: string): Promise<readonly DomainMappingRecord[]> {
    return this.domainMappingRepo.listByStorefront(storefrontId);
  }

  async removeDomainMapping(id: string): Promise<void> {
    await this.domainMappingRepo.delete(id);
  }
}

// ─── Theme Admin Service ───

export class ThemeAdminService {
  constructor(
    private readonly themeRepo: ThemeRepositoryPort,
    private readonly versionRepo: ThemeVersionRepositoryPort,
    private readonly tokenSetRepo: ThemeTokenSetRepositoryPort,
    private readonly tokenRepo: ThemeTokenRepositoryPort,
  ) { }

  async createTheme(input: {
    storefrontId: string;
    code: string;
    name: string;
  }): Promise<StorefrontThemeRecord> {
    const record: StorefrontThemeRecord = {
      id: generateId("thm_"),
      storefrontId: input.storefrontId,
      code: input.code,
      name: input.name,
      status: "active",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await this.themeRepo.save(record);
    return record;
  }

  async createVersion(input: {
    themeId: string;
    version: string;
    description?: string;
    baseThemeRef?: string | null;
    createdBy: string;
  }): Promise<ThemeVersionRecord> {
    const record: ThemeVersionRecord = {
      id: generateId("tv_"),
      themeId: input.themeId,
      version: input.version,
      state: "draft",
      baseThemeRef: input.baseThemeRef ?? null,
      description: input.description ?? "",
      createdBy: input.createdBy,
      publishedBy: null,
      createdAt: nowIso(),
      publishedAt: null,
    };
    await this.versionRepo.save(record);
    return record;
  }

  async setTokens(input: {
    themeVersionId: string;
    mode: string;
    tokens: readonly {
      group: string;
      name: string;
      value: string;
      type: string;
      reference?: string | null;
      metadata?: Record<string, unknown>;
    }[];
  }): Promise<ThemeTokenSetRecord> {
    const tokenSet: ThemeTokenSetRecord = {
      id: generateId("ts_"),
      themeVersionId: input.themeVersionId,
      mode: input.mode as ThemeTokenSetRecord["mode"],
      status: "active",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await this.tokenSetRepo.save(tokenSet);

    const tokenRecords: ThemeTokenRecord[] = input.tokens.map((t) => ({
      id: generateId("tk_"),
      tokenSetId: tokenSet.id,
      group: t.group as ThemeTokenRecord["group"],
      name: t.name,
      value: t.value,
      type: t.type as ThemeTokenRecord["type"],
      reference: t.reference ?? null,
      metadata: t.metadata ?? {},
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }));

    await this.tokenRepo.saveBatch(tokenRecords);
    return tokenSet;
  }

  async lintTheme(themeVersionId: string): Promise<ThemeLintResult> {
    const tokenSets = await this.tokenSetRepo.listByThemeVersion(themeVersionId);
    const defaultSet = tokenSets.find((ts) => ts.mode === "default");
    if (!defaultSet) {
      return {
        valid: false,
        missingTokens: ["All tokens missing - no default token set"],
        contrastFailures: [],
        warnings: [],
      };
    }
    const tokens = await this.tokenRepo.listByTokenSet(defaultSet.id);
    return lintThemeTokens(tokens);
  }

  async compileThemeCss(themeVersionId: string): Promise<{ cssText: string; variables: Record<string, string> }> {
    const tokenSets = await this.tokenSetRepo.listByThemeVersion(themeVersionId);
    const parts: string[] = [];
    let allVars: Record<string, string> = {};

    for (const ts of tokenSets) {
      const tokens = await this.tokenRepo.listByTokenSet(ts.id);
      const compiled = compileTokenSet(tokens, ts.mode);
      parts.push(compiled.cssText);
      if (ts.mode === "default") {
        for (const [k, v] of compiled.cssVariables) {
          allVars[k] = v;
        }
      }
    }

    return { cssText: parts.join("\n\n"), variables: allVars };
  }

  async getTheme(id: string): Promise<StorefrontThemeRecord | null> {
    return this.themeRepo.getById(id);
  }

  async listThemes(storefrontId: string): Promise<readonly StorefrontThemeRecord[]> {
    return this.themeRepo.listByStorefront(storefrontId);
  }

  async listVersions(themeId: string): Promise<readonly ThemeVersionRecord[]> {
    return this.versionRepo.listByTheme(themeId);
  }

  async getVersion(id: string): Promise<ThemeVersionRecord | null> {
    return this.versionRepo.getById(id);
  }
}

// ─── Layout Admin Service ───

export class LayoutAdminService {
  constructor(
    private readonly templateRepo: LayoutTemplateRepositoryPort,
    private readonly versionRepo: LayoutVersionRepositoryPort,
    private readonly slotRepo: LayoutSlotDefinitionRepositoryPort,
  ) { }

  async createTemplate(input: {
    storefrontId: string;
    code: string;
    name: string;
    pageType: string;
    description?: string;
  }): Promise<LayoutTemplateRecord> {
    const record: LayoutTemplateRecord = {
      id: generateId("lay_"),
      storefrontId: input.storefrontId,
      code: input.code,
      name: input.name,
      pageType: input.pageType as LayoutTemplateRecord["pageType"],
      description: input.description ?? "",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await this.templateRepo.save(record);
    return record;
  }

  async createVersion(input: {
    layoutTemplateId: string;
    version: string;
    schema?: Record<string, unknown>;
    slots: readonly {
      slotKey: string;
      displayName: string;
      allowedBlockCategories: readonly string[];
      minBlocks: number;
      maxBlocks: number;
      required?: boolean;
      responsiveRules?: Record<string, unknown>;
      orderingRules?: Record<string, unknown>;
    }[];
    createdBy: string;
  }): Promise<LayoutVersionRecord> {
    const version: LayoutVersionRecord = {
      id: generateId("lv_"),
      layoutTemplateId: input.layoutTemplateId,
      version: input.version,
      state: "draft",
      schema: input.schema ?? {},
      createdBy: input.createdBy,
      publishedBy: null,
      createdAt: nowIso(),
      publishedAt: null,
    };
    await this.versionRepo.save(version);

    const slotRecords: LayoutSlotDefinitionRecord[] = input.slots.map((s) => ({
      id: generateId("lsd_"),
      layoutVersionId: version.id,
      slotKey: s.slotKey,
      displayName: s.displayName,
      allowedBlockCategories: s.allowedBlockCategories as readonly LayoutSlotDefinitionRecord["allowedBlockCategories"][number][],
      minBlocks: s.minBlocks,
      maxBlocks: s.maxBlocks,
      required: s.required ?? false,
      responsiveRules: s.responsiveRules ?? {},
      orderingRules: s.orderingRules ?? {},
    }));
    await this.slotRepo.saveBatch(slotRecords);

    return version;
  }

  async getTemplate(id: string): Promise<LayoutTemplateRecord | null> {
    return this.templateRepo.getById(id);
  }

  async listTemplates(storefrontId: string): Promise<readonly LayoutTemplateRecord[]> {
    return this.templateRepo.listByStorefront(storefrontId);
  }

  async getVersion(id: string): Promise<LayoutVersionRecord | null> {
    return this.versionRepo.getById(id);
  }

  async getSlots(layoutVersionId: string): Promise<readonly LayoutSlotDefinitionRecord[]> {
    return this.slotRepo.listByLayoutVersion(layoutVersionId);
  }
}

// ─── Page Admin Service ───

export class PageAdminService {
  constructor(
    private readonly pageRepo: PageDefinitionRepositoryPort,
    private readonly versionRepo: PageVersionRepositoryPort,
    private readonly routeRepo: PageRouteRepositoryPort,
    private readonly blockInstanceRepo: BlockInstanceRepositoryPort,
  ) { }

  async createPage(input: {
    storefrontId: string;
    code: string;
    pageType: string;
    name: string;
    seoProfileId?: string | null;
  }): Promise<PageDefinitionRecord> {
    const record: PageDefinitionRecord = {
      id: generateId("pg_"),
      storefrontId: input.storefrontId,
      code: input.code,
      pageType: input.pageType as PageDefinitionRecord["pageType"],
      name: input.name,
      seoProfileId: input.seoProfileId ?? null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await this.pageRepo.save(record);
    return record;
  }

  async createVersion(input: {
    pageDefinitionId: string;
    layoutVersionId: string;
    version: string;
    locale: string;
    title: string;
    description?: string;
    contentSchemaVersion?: string;
    blocks?: readonly {
      slotKey: string;
      blockVersionId: string;
      instanceKey: string;
      sortOrder: number;
      config?: Record<string, unknown>;
      contentRef?: string | null;
      visibilityRules?: Record<string, unknown> | null;
    }[];
    createdBy: string;
  }): Promise<PageVersionRecord> {
    const version: PageVersionRecord = {
      id: generateId("pv_"),
      pageDefinitionId: input.pageDefinitionId,
      layoutVersionId: input.layoutVersionId,
      version: input.version,
      state: "draft",
      locale: input.locale,
      title: input.title,
      description: input.description ?? "",
      contentSchemaVersion: input.contentSchemaVersion ?? "1.0.0",
      createdBy: input.createdBy,
      publishedBy: null,
      createdAt: nowIso(),
      publishedAt: null,
    };
    await this.versionRepo.save(version);

    if (input.blocks && input.blocks.length > 0) {
      const blockRecords: BlockInstanceRecord[] = input.blocks.map((b) => ({
        id: generateId("bi_"),
        pageVersionId: version.id,
        slotKey: b.slotKey,
        blockVersionId: b.blockVersionId,
        instanceKey: b.instanceKey,
        sortOrder: b.sortOrder,
        config: b.config ?? {},
        contentRef: b.contentRef ?? null,
        visibilityRules: (b.visibilityRules ?? null) as BlockInstanceRecord["visibilityRules"],
        experimentRef: null,
        personalizationRules: null,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      }));
      await this.blockInstanceRepo.saveBatch(blockRecords);
    }

    return version;
  }

  async addRoute(input: {
    storefrontId: string;
    pageDefinitionId: string;
    routeType: string;
    pathPattern: string;
    locale: string;
    canonicalRoute?: boolean;
  }): Promise<PageRouteRecord> {
    const record: PageRouteRecord = {
      id: generateId("rt_"),
      storefrontId: input.storefrontId,
      pageDefinitionId: input.pageDefinitionId,
      routeType: input.routeType as PageRouteRecord["routeType"],
      pathPattern: input.pathPattern,
      locale: input.locale,
      status: "active",
      canonicalRoute: input.canonicalRoute ?? true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await this.routeRepo.save(record);
    return record;
  }

  async getPage(id: string): Promise<PageDefinitionRecord | null> {
    return this.pageRepo.getById(id);
  }

  async listPages(storefrontId: string): Promise<readonly PageDefinitionRecord[]> {
    return this.pageRepo.listByStorefront(storefrontId);
  }

  async getVersion(id: string): Promise<PageVersionRecord | null> {
    return this.versionRepo.getById(id);
  }

  async getBlocks(pageVersionId: string): Promise<readonly BlockInstanceRecord[]> {
    return this.blockInstanceRepo.listByPageVersion(pageVersionId);
  }

  async getRoutes(storefrontId: string): Promise<readonly PageRouteRecord[]> {
    return this.routeRepo.listByStorefront(storefrontId);
  }
}

// ─── Publish Service ───

export class PublishService {
  constructor(
    private readonly publishJobRepo: PublishJobRepositoryPort,
  ) { }

  async requestPublish(input: {
    storefrontId: string;
    targetType: string;
    targetId: string;
    sourceVersion: string;
    targetVersion: string;
    createdBy: string;
    currentState: PublishState;
  }): Promise<PublishJobRecord> {
    if (!canTransitionTo(input.currentState, "published")) {
      throw new Error(
        `Cannot publish from state "${input.currentState}"`,
      );
    }

    const job: PublishJobRecord = {
      id: generateId("pj_"),
      storefrontId: input.storefrontId,
      targetType: input.targetType as PublishJobRecord["targetType"],
      targetId: input.targetId,
      sourceVersion: input.sourceVersion,
      targetVersion: input.targetVersion,
      status: "pending",
      validationReport: {},
      createdBy: input.createdBy,
      createdAt: nowIso(),
      completedAt: null,
    };
    await this.publishJobRepo.save(job);
    return job;
  }

  async getJob(id: string): Promise<PublishJobRecord | null> {
    return this.publishJobRepo.getById(id);
  }

  async listJobs(storefrontId: string): Promise<readonly PublishJobRecord[]> {
    return this.publishJobRepo.listByStorefront(storefrontId);
  }
}

// ─── Preview Service ───

export class PreviewService {
  constructor(
    private readonly previewRepo: PreviewSessionRepositoryPort,
  ) { }

  async createSession(input: {
    storefrontId: string;
    actorId: string;
    scopeType: string;
    scopeId: string;
    ttlSeconds?: number;
  }): Promise<{ session: PreviewSessionRecord; token: string }> {
    const ttl = Math.min(
      input.ttlSeconds ?? DEFAULT_PREVIEW_SESSION_TTL_SECONDS,
      MAX_PREVIEW_SESSION_TTL_SECONDS,
    );

    const token = generateId("pvt_") + generateId("");
    // In production, use a proper crypto hash
    const tokenHash = await hashToken(token);

    const session: PreviewSessionRecord = {
      id: generateId("ps_"),
      storefrontId: input.storefrontId,
      actorId: input.actorId,
      scopeType: input.scopeType as PreviewSessionRecord["scopeType"],
      scopeId: input.scopeId,
      tokenHash,
      expiresAt: new Date(Date.now() + ttl * 1000).toISOString(),
      revokedAt: null,
      createdAt: nowIso(),
    };

    await this.previewRepo.save(session);
    return { session, token };
  }

  async validateToken(token: string): Promise<PreviewSessionRecord | null> {
    const hash = await hashToken(token);
    const session = await this.previewRepo.getByTokenHash(hash);
    if (!session) return null;
    if (session.revokedAt) return null;
    if (new Date(session.expiresAt) < new Date()) return null;
    return session;
  }

  async revokeSession(id: string): Promise<void> {
    await this.previewRepo.revoke(id, nowIso());
  }
}

async function hashToken(token: string): Promise<string> {
  const cryptoLike = globalThis as typeof globalThis & { readonly crypto?: CryptoLike };

  // Use Web Crypto API when available without requiring DOM libs in this package.
  if (cryptoLike.crypto?.subtle !== undefined) {
    const data = Uint8Array.from(token, (character) => character.charCodeAt(0));
    const hash = await cryptoLike.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Fallback for environments without Web Crypto
  return token;
}

// ─── Content Admin Service ───

export class ContentAdminService {
  constructor(
    private readonly contentRepo: ContentEntryRepositoryPort,
    private readonly navMenuRepo: NavigationMenuRepositoryPort,
    private readonly navItemRepo: NavigationMenuItemRepositoryPort,
  ) { }

  async createContentEntry(input: {
    storefrontId: string;
    contentType: string;
    code: string;
    locale: string;
    data: Record<string, unknown>;
    schema?: Record<string, unknown>;
    scheduleStart?: string | null;
    scheduleEnd?: string | null;
  }): Promise<ContentEntryRecord> {
    const record: ContentEntryRecord = {
      id: generateId("ce_"),
      storefrontId: input.storefrontId,
      contentType: input.contentType,
      code: input.code,
      locale: input.locale,
      state: "draft",
      schema: input.schema ?? {},
      data: input.data,
      scheduleStart: input.scheduleStart ?? null,
      scheduleEnd: input.scheduleEnd ?? null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await this.contentRepo.save(record);
    return record;
  }

  async updateContentEntry(
    id: string,
    input: Partial<Pick<ContentEntryRecord, "data" | "state" | "scheduleStart" | "scheduleEnd">>,
  ): Promise<ContentEntryRecord> {
    const existing = await this.contentRepo.getById(id);
    if (!existing) throw new Error(`Content entry "${id}" not found`);

    const updated: ContentEntryRecord = {
      ...existing,
      ...input,
      updatedAt: nowIso(),
    };
    await this.contentRepo.save(updated);
    return updated;
  }

  async getContentEntry(id: string): Promise<ContentEntryRecord | null> {
    return this.contentRepo.getById(id);
  }

  async listContentEntries(storefrontId: string): Promise<readonly ContentEntryRecord[]> {
    return this.contentRepo.listByStorefront(storefrontId);
  }

  async createNavigationMenu(input: {
    storefrontId: string;
    code: string;
    name: string;
    locale: string;
    items: readonly {
      label: string;
      itemType: string;
      href?: string | null;
      pageRef?: string | null;
      externalTarget?: string | null;
      sortOrder: number;
      parentItemId?: string | null;
    }[];
  }): Promise<NavigationMenuRecord> {
    const menu: NavigationMenuRecord = {
      id: generateId("nm_"),
      storefrontId: input.storefrontId,
      code: input.code,
      name: input.name,
      locale: input.locale,
      state: "draft",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await this.navMenuRepo.save(menu);

    const itemRecords: NavigationMenuItemRecord[] = input.items.map((item) => ({
      id: generateId("ni_"),
      navigationMenuId: menu.id,
      parentItemId: item.parentItemId ?? null,
      label: item.label,
      itemType: item.itemType as NavigationMenuItemRecord["itemType"],
      href: item.href ?? null,
      pageRef: item.pageRef ?? null,
      externalTarget: item.externalTarget ?? null,
      sortOrder: item.sortOrder,
      visibilityRules: null,
    }));
    await this.navItemRepo.saveBatch(itemRecords);

    return menu;
  }

  async getNavigationMenu(id: string): Promise<NavigationMenuRecord | null> {
    return this.navMenuRepo.getById(id);
  }

  async listNavigationMenus(storefrontId: string): Promise<readonly NavigationMenuRecord[]> {
    return this.navMenuRepo.listByStorefront(storefrontId);
  }
}

// ─── SEO Admin Service ───

export class SeoAdminService {
  constructor(
    private readonly seoProfileRepo: SeoProfileRepositoryPort,
    private readonly redirectRepo: RedirectRuleRepositoryPort,
  ) { }

  async createSeoProfile(input: {
    storefrontId: string;
    code: string;
    titleTemplate: string;
    descriptionTemplate?: string;
    robots?: string;
    canonicalStrategy?: string;
    structuredDataConfig?: Record<string, unknown>;
    socialMeta?: Record<string, unknown>;
  }): Promise<SeoProfileRecord> {
    const record: SeoProfileRecord = {
      id: generateId("seo_"),
      storefrontId: input.storefrontId,
      code: input.code,
      titleTemplate: input.titleTemplate,
      descriptionTemplate: input.descriptionTemplate ?? "",
      robots: input.robots ?? "index, follow",
      canonicalStrategy: input.canonicalStrategy ?? "path-based",
      structuredDataConfig: input.structuredDataConfig ?? {},
      socialMeta: input.socialMeta ?? {},
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await this.seoProfileRepo.save(record);
    return record;
  }

  async getSeoProfile(id: string): Promise<SeoProfileRecord | null> {
    return this.seoProfileRepo.getById(id);
  }

  async listSeoProfiles(storefrontId: string): Promise<readonly SeoProfileRecord[]> {
    return this.seoProfileRepo.listByStorefront(storefrontId);
  }

  async createRedirect(input: {
    storefrontId: string;
    sourcePath: string;
    destinationPath: string;
    httpStatus?: string;
  }): Promise<RedirectRuleRecord> {
    const record: RedirectRuleRecord = {
      id: generateId("rr_"),
      storefrontId: input.storefrontId,
      sourcePath: input.sourcePath,
      destinationPath: input.destinationPath,
      httpStatus: normalizeRedirectHttpStatus(input.httpStatus),
      active: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await this.redirectRepo.save(record);
    return record;
  }

  async listRedirects(storefrontId: string): Promise<readonly RedirectRuleRecord[]> {
    return this.redirectRepo.listByStorefront(storefrontId);
  }
}

// ─── Block Admin Service ───

export class BlockAdminService {
  constructor(
    private readonly blockRepo: BlockDefinitionRepositoryPort,
    private readonly versionRepo: BlockVersionRepositoryPort,
  ) { }

  async createBlockDefinition(input: {
    code: string;
    category: string;
    displayName: string;
    description?: string;
    icon?: string;
  }): Promise<BlockDefinitionRecord> {
    const record: BlockDefinitionRecord = {
      id: generateId("blk_"),
      code: input.code,
      category: input.category as BlockDefinitionRecord["category"],
      displayName: input.displayName,
      description: input.description ?? "",
      icon: input.icon ?? "box",
      status: "active",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await this.blockRepo.save(record);
    return record;
  }

  async createBlockVersion(input: {
    blockDefinitionId: string;
    version: string;
    configSchema: Record<string, unknown>;
    contentSchema: Record<string, unknown>;
    defaultConfig?: Record<string, unknown>;
    defaultContent?: Record<string, unknown>;
    allowedPageTypes?: readonly string[];
    allowedSlots?: readonly string[];
    hydrationStrategy?: string;
    cachePolicy?: { maxAge: number; staleWhileRevalidate: number; tags: string[] };
  }): Promise<BlockVersionRecord> {
    const record: BlockVersionRecord = {
      id: generateId("bv_"),
      blockDefinitionId: input.blockDefinitionId,
      version: input.version,
      state: "draft",
      configSchema: input.configSchema,
      contentSchema: input.contentSchema,
      defaultConfig: input.defaultConfig ?? {},
      defaultContent: input.defaultContent ?? {},
      allowedPageTypes: (input.allowedPageTypes ?? []) as readonly BlockVersionRecord["allowedPageTypes"][number][],
      allowedSlots: input.allowedSlots ?? [],
      dataRequirements: {},
      cachePolicy: {
        maxAge: input.cachePolicy?.maxAge ?? 3600,
        staleWhileRevalidate: input.cachePolicy?.staleWhileRevalidate ?? 60,
        tags: input.cachePolicy?.tags ?? [],
      },
      seoPolicy: {},
      hydrationStrategy: (input.hydrationStrategy ?? "server-only") as BlockVersionRecord["hydrationStrategy"],
      deprecationStatus: "none",
      migrationStrategy: null,
      createdAt: nowIso(),
      publishedAt: null,
    };
    await this.versionRepo.save(record);
    return record;
  }

  async getBlockDefinition(id: string): Promise<BlockDefinitionRecord | null> {
    return this.blockRepo.getById(id);
  }

  async listBlockDefinitions(): Promise<readonly BlockDefinitionRecord[]> {
    return this.blockRepo.listAll();
  }

  async getBlockVersion(id: string): Promise<BlockVersionRecord | null> {
    return this.versionRepo.getById(id);
  }

  async listBlockVersions(blockDefinitionId: string): Promise<readonly BlockVersionRecord[]> {
    return this.versionRepo.listByBlock(blockDefinitionId);
  }
}
