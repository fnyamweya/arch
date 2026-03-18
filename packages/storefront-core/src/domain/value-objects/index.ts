import { ValueObject } from "@arch/shared-kernel";

export class TenantId extends ValueObject<string> {
  private static readonly PATTERN = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;

  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): TenantId {
    const trimmed = value.trim();
    if (!TenantId.PATTERN.test(trimmed)) {
      throw new Error(`Invalid TenantId: "${trimmed}". Must be 3-63 lowercase alphanumeric characters or hyphens.`);
    }
    return new TenantId(trimmed);
  }

  public static fromTrusted(value: string): TenantId {
    return new TenantId(value);
  }

  public override toString(): string {
    return this.value;
  }
}

export class StorefrontId extends ValueObject<string> {
  private static readonly PATTERN = /^sf_[a-z0-9]{20,}$/;

  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): StorefrontId {
    const trimmed = value.trim();
    if (!StorefrontId.PATTERN.test(trimmed)) {
      throw new Error(`Invalid StorefrontId: "${trimmed}".`);
    }
    return new StorefrontId(trimmed);
  }

  public static fromTrusted(value: string): StorefrontId {
    return new StorefrontId(value);
  }

  public override toString(): string {
    return this.value;
  }
}

export class ThemeId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): ThemeId {
    if (!value || value.length < 3) {
      throw new Error(`Invalid ThemeId: "${value}".`);
    }
    return new ThemeId(value);
  }

  public static fromTrusted(value: string): ThemeId {
    return new ThemeId(value);
  }

  public override toString(): string {
    return this.value;
  }
}

export class ThemeVersionId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static fromTrusted(value: string): ThemeVersionId {
    return new ThemeVersionId(value);
  }

  public override toString(): string {
    return this.value;
  }
}

export class LayoutId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static fromTrusted(value: string): LayoutId {
    return new LayoutId(value);
  }

  public override toString(): string {
    return this.value;
  }
}

export class LayoutVersionId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static fromTrusted(value: string): LayoutVersionId {
    return new LayoutVersionId(value);
  }

  public override toString(): string {
    return this.value;
  }
}

export class PageId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static fromTrusted(value: string): PageId {
    return new PageId(value);
  }

  public override toString(): string {
    return this.value;
  }
}

export class RoutePath extends ValueObject<string> {
  private static readonly PATTERN = /^\/[a-z0-9/_:*[\]-]*$/;

  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RoutePath {
    const normalized = value.trim().toLowerCase();
    if (normalized !== "/" && !RoutePath.PATTERN.test(normalized)) {
      throw new Error(`Invalid RoutePath: "${normalized}".`);
    }
    return new RoutePath(normalized);
  }

  public static fromTrusted(value: string): RoutePath {
    return new RoutePath(value);
  }

  public override toString(): string {
    return this.value;
  }
}

export class DomainName extends ValueObject<string> {
  private static readonly PATTERN = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;

  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): DomainName {
    const normalized = value.trim().toLowerCase();
    if (!DomainName.PATTERN.test(normalized)) {
      throw new Error(`Invalid DomainName: "${normalized}".`);
    }
    return new DomainName(normalized);
  }

  public static fromTrusted(value: string): DomainName {
    return new DomainName(value);
  }

  public override toString(): string {
    return this.value;
  }
}

export class BlockCode extends ValueObject<string> {
  private static readonly PATTERN = /^[a-z][a-z0-9-]{1,62}[a-z0-9]$/;

  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): BlockCode {
    const trimmed = value.trim().toLowerCase();
    if (!BlockCode.PATTERN.test(trimmed)) {
      throw new Error(`Invalid BlockCode: "${trimmed}". Must be lowercase alphanumeric with hyphens, 3-64 chars.`);
    }
    return new BlockCode(trimmed);
  }

  public static fromTrusted(value: string): BlockCode {
    return new BlockCode(value);
  }

  public override toString(): string {
    return this.value;
  }
}

export class SemanticVersion extends ValueObject<string> {
  private static readonly PATTERN = /^\d+\.\d+\.\d+$/;

  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): SemanticVersion {
    if (!SemanticVersion.PATTERN.test(value)) {
      throw new Error(`Invalid SemanticVersion: "${value}". Expected format: major.minor.patch`);
    }
    return new SemanticVersion(value);
  }

  public static fromTrusted(value: string): SemanticVersion {
    return new SemanticVersion(value);
  }

  public get major(): number {
    return Number.parseInt(this.value.split(".")[0]!, 10);
  }

  public get minor(): number {
    return Number.parseInt(this.value.split(".")[1]!, 10);
  }

  public get patch(): number {
    return Number.parseInt(this.value.split(".")[2]!, 10);
  }

  public isCompatibleWith(other: SemanticVersion): boolean {
    return this.major === other.major;
  }

  public override toString(): string {
    return this.value;
  }
}

export class TokenName extends ValueObject<string> {
  private static readonly PATTERN = /^[a-z][a-z0-9-]{0,62}$/;

  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): TokenName {
    const trimmed = value.trim().toLowerCase();
    if (!TokenName.PATTERN.test(trimmed)) {
      throw new Error(`Invalid TokenName: "${trimmed}".`);
    }
    return new TokenName(trimmed);
  }

  public static fromTrusted(value: string): TokenName {
    return new TokenName(value);
  }

  public override toString(): string {
    return this.value;
  }
}

export class Slug extends ValueObject<string> {
  private static readonly PATTERN = /^[a-z0-9][a-z0-9-]{0,126}[a-z0-9]$/;

  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): Slug {
    const normalized = value.trim().toLowerCase();
    if (normalized.length < 2 || !Slug.PATTERN.test(normalized)) {
      throw new Error(`Invalid Slug: "${normalized}".`);
    }
    return new Slug(normalized);
  }

  public static fromTrusted(value: string): Slug {
    return new Slug(value);
  }

  public override toString(): string {
    return this.value;
  }
}

export class LocaleCode extends ValueObject<string> {
  private static readonly PATTERN = /^[a-z]{2}(?:-[A-Z]{2})?$/;

  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): LocaleCode {
    if (!LocaleCode.PATTERN.test(value)) {
      throw new Error(`Invalid LocaleCode: "${value}". Expected: "en" or "en-US".`);
    }
    return new LocaleCode(value);
  }

  public static fromTrusted(value: string): LocaleCode {
    return new LocaleCode(value);
  }

  public get language(): string {
    return this.value.split("-")[0]!;
  }

  public override toString(): string {
    return this.value;
  }
}

export class CacheTag extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(scope: string, entity: string, id: string): CacheTag {
    return new CacheTag(`${scope}:${entity}:${id}`);
  }

  public static fromTrusted(value: string): CacheTag {
    return new CacheTag(value);
  }

  public override toString(): string {
    return this.value;
  }
}

export class PreviewToken extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static fromTrusted(value: string): PreviewToken {
    return new PreviewToken(value);
  }

  public override toString(): string {
    return this.value;
  }
}

export class ContentEntryRef extends ValueObject<{ readonly contentType: string; readonly code: string; readonly locale: string }> {
  private constructor(value: { readonly contentType: string; readonly code: string; readonly locale: string }) {
    super(value);
  }

  public static create(contentType: string, code: string, locale: string): ContentEntryRef {
    return new ContentEntryRef({ contentType, code, locale });
  }

  public get contentType(): string {
    return this.value.contentType;
  }

  public get code(): string {
    return this.value.code;
  }

  public get locale(): string {
    return this.value.locale;
  }
}
