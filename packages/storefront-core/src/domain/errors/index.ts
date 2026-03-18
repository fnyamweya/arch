import { DomainError } from "@arch/shared-kernel";

export class StorefrontNotFoundError extends DomainError {
  public constructor(id: string) {
    super({ code: "STOREFRONT_NOT_FOUND", message: `Storefront not found: ${id}` });
  }
}

export class StorefrontAlreadyExistsError extends DomainError {
  public constructor(code: string) {
    super({ code: "STOREFRONT_ALREADY_EXISTS", message: `Storefront with code "${code}" already exists` });
  }
}

export class DomainAlreadyMappedError extends DomainError {
  public constructor(domain: string) {
    super({ code: "DOMAIN_ALREADY_MAPPED", message: `Domain "${domain}" is already mapped to a storefront` });
  }
}

export class DomainNotVerifiedError extends DomainError {
  public constructor(domain: string) {
    super({ code: "DOMAIN_NOT_VERIFIED", message: `Domain "${domain}" has not been verified` });
  }
}

export class ThemeNotFoundError extends DomainError {
  public constructor(id: string) {
    super({ code: "THEME_NOT_FOUND", message: `Theme not found: ${id}` });
  }
}

export class ThemeVersionNotFoundError extends DomainError {
  public constructor(id: string) {
    super({ code: "THEME_VERSION_NOT_FOUND", message: `Theme version not found: ${id}` });
  }
}

export class ThemeTokensMissingError extends DomainError {
  public constructor(missing: readonly string[]) {
    super({
      code: "THEME_TOKENS_MISSING",
      message: `Required semantic tokens missing: ${missing.join(", ")}`,
      context: { missingTokens: missing },
    });
  }
}

export class ThemeContrastError extends DomainError {
  public constructor(pairs: readonly { foreground: string; background: string; ratio: number }[]) {
    super({
      code: "THEME_CONTRAST_INSUFFICIENT",
      message: `${pairs.length} color pair(s) fail WCAG AA contrast requirements`,
      context: { failingPairs: pairs },
    });
  }
}

export class LayoutNotFoundError extends DomainError {
  public constructor(id: string) {
    super({ code: "LAYOUT_NOT_FOUND", message: `Layout not found: ${id}` });
  }
}

export class LayoutVersionNotFoundError extends DomainError {
  public constructor(id: string) {
    super({ code: "LAYOUT_VERSION_NOT_FOUND", message: `Layout version not found: ${id}` });
  }
}

export class LayoutSlotViolationError extends DomainError {
  public constructor(slotKey: string, reason: string) {
    super({
      code: "LAYOUT_SLOT_VIOLATION",
      message: `Slot "${slotKey}" violation: ${reason}`,
      context: { slotKey, reason },
    });
  }
}

export class PageNotFoundError extends DomainError {
  public constructor(id: string) {
    super({ code: "PAGE_NOT_FOUND", message: `Page not found: ${id}` });
  }
}

export class PageVersionNotFoundError extends DomainError {
  public constructor(id: string) {
    super({ code: "PAGE_VERSION_NOT_FOUND", message: `Page version not found: ${id}` });
  }
}

export class PagePublishValidationError extends DomainError {
  public constructor(errors: readonly string[]) {
    super({
      code: "PAGE_PUBLISH_VALIDATION_FAILED",
      message: `Page publish validation failed: ${errors.join("; ")}`,
      context: { validationErrors: errors },
    });
  }
}

export class BlockDefinitionNotFoundError extends DomainError {
  public constructor(id: string) {
    super({ code: "BLOCK_DEFINITION_NOT_FOUND", message: `Block definition not found: ${id}` });
  }
}

export class BlockVersionNotFoundError extends DomainError {
  public constructor(id: string) {
    super({ code: "BLOCK_VERSION_NOT_FOUND", message: `Block version not found: ${id}` });
  }
}

export class BlockConfigValidationError extends DomainError {
  public constructor(blockCode: string, errors: readonly string[]) {
    super({
      code: "BLOCK_CONFIG_VALIDATION_FAILED",
      message: `Block "${blockCode}" config validation failed`,
      context: { blockCode, validationErrors: errors },
    });
  }
}

export class BlockSlotCompatibilityError extends DomainError {
  public constructor(blockCode: string, slotKey: string) {
    super({
      code: "BLOCK_SLOT_INCOMPATIBLE",
      message: `Block "${blockCode}" is not compatible with slot "${slotKey}"`,
      context: { blockCode, slotKey },
    });
  }
}

export class RouteConflictError extends DomainError {
  public constructor(path: string) {
    super({ code: "ROUTE_CONFLICT", message: `Route conflict: path "${path}" already resolves to an active page` });
  }
}

export class RouteNotFoundError extends DomainError {
  public constructor(path: string) {
    super({ code: "ROUTE_NOT_FOUND", message: `No published page found for path: ${path}` });
  }
}

export class PreviewSessionExpiredError extends DomainError {
  public constructor(id: string) {
    super({ code: "PREVIEW_SESSION_EXPIRED", message: `Preview session expired: ${id}` });
  }
}

export class PreviewSessionRevokedError extends DomainError {
  public constructor(id: string) {
    super({ code: "PREVIEW_SESSION_REVOKED", message: `Preview session has been revoked: ${id}` });
  }
}

export class PublishNotAllowedError extends DomainError {
  public constructor(reason: string) {
    super({ code: "PUBLISH_NOT_ALLOWED", message: `Publish not allowed: ${reason}` });
  }
}

export class ContentEntryNotFoundError extends DomainError {
  public constructor(id: string) {
    super({ code: "CONTENT_ENTRY_NOT_FOUND", message: `Content entry not found: ${id}` });
  }
}

export class NavigationMenuNotFoundError extends DomainError {
  public constructor(id: string) {
    super({ code: "NAVIGATION_MENU_NOT_FOUND", message: `Navigation menu not found: ${id}` });
  }
}

export class SeoProfileNotFoundError extends DomainError {
  public constructor(id: string) {
    super({ code: "SEO_PROFILE_NOT_FOUND", message: `SEO profile not found: ${id}` });
  }
}

export class RedirectNotFoundError extends DomainError {
  public constructor(id: string) {
    super({ code: "REDIRECT_NOT_FOUND", message: `Redirect not found: ${id}` });
  }
}

export class InsufficientPermissionsError extends DomainError {
  public constructor(action: string) {
    super({ code: "INSUFFICIENT_PERMISSIONS", message: `Insufficient permissions for: ${action}` });
  }
}

export class TenantScopeViolationError extends DomainError {
  public constructor(tenantId: string, resourceTenantId: string) {
    super({
      code: "TENANT_SCOPE_VIOLATION",
      message: "Cannot access resources across tenant boundaries",
      context: { tenantId, resourceTenantId },
    });
  }
}

export class UnsafeContentError extends DomainError {
  public constructor(field: string) {
    super({
      code: "UNSAFE_CONTENT",
      message: `Unsafe content detected in field "${field}". HTML/script injection is not allowed.`,
      context: { field },
    });
  }
}
