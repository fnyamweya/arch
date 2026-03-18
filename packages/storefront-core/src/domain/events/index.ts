export const STOREFRONT_EVENTS = {
  // Storefront lifecycle
  STOREFRONT_CREATED: "storefront.created",
  STOREFRONT_UPDATED: "storefront.updated",
  STOREFRONT_ACTIVATED: "storefront.activated",
  STOREFRONT_DEACTIVATED: "storefront.deactivated",
  STOREFRONT_SUSPENDED: "storefront.suspended",

  // Domain mapping
  DOMAIN_MAPPED: "storefront.domain.mapped",
  DOMAIN_VERIFIED: "storefront.domain.verified",
  DOMAIN_REMOVED: "storefront.domain.removed",

  // Theme lifecycle
  THEME_CREATED: "storefront.theme.created",
  THEME_VERSION_CREATED: "storefront.theme.version.created",
  THEME_VERSION_PUBLISHED: "storefront.theme.version.published",
  THEME_VERSION_ROLLED_BACK: "storefront.theme.version.rolled-back",
  THEME_VERSION_ARCHIVED: "storefront.theme.version.archived",
  THEME_TOKENS_UPDATED: "storefront.theme.tokens.updated",
  THEME_COMPILED: "storefront.theme.compiled",
  THEME_LINT_COMPLETED: "storefront.theme.lint.completed",

  // Layout lifecycle
  LAYOUT_CREATED: "storefront.layout.created",
  LAYOUT_VERSION_CREATED: "storefront.layout.version.created",
  LAYOUT_VERSION_PUBLISHED: "storefront.layout.version.published",
  LAYOUT_VERSION_ROLLED_BACK: "storefront.layout.version.rolled-back",
  LAYOUT_VALIDATED: "storefront.layout.validated",

  // Page lifecycle
  PAGE_CREATED: "storefront.page.created",
  PAGE_VERSION_CREATED: "storefront.page.version.created",
  PAGE_VERSION_PUBLISHED: "storefront.page.version.published",
  PAGE_VERSION_ROLLED_BACK: "storefront.page.version.rolled-back",
  PAGE_VALIDATED: "storefront.page.validated",

  // Block lifecycle
  BLOCK_DEFINITION_CREATED: "storefront.block.definition.created",
  BLOCK_VERSION_CREATED: "storefront.block.version.created",
  BLOCK_VERSION_PUBLISHED: "storefront.block.version.published",
  BLOCK_VERSION_DEPRECATED: "storefront.block.version.deprecated",
  BLOCK_INSTANCE_ADDED: "storefront.block.instance.added",
  BLOCK_INSTANCE_UPDATED: "storefront.block.instance.updated",
  BLOCK_INSTANCE_REMOVED: "storefront.block.instance.removed",
  BLOCK_INSTANCES_REORDERED: "storefront.block.instances.reordered",

  // Content lifecycle
  CONTENT_ENTRY_CREATED: "storefront.content.entry.created",
  CONTENT_ENTRY_UPDATED: "storefront.content.entry.updated",
  CONTENT_ENTRY_PUBLISHED: "storefront.content.entry.published",
  CONTENT_ENTRY_ARCHIVED: "storefront.content.entry.archived",

  // Navigation
  NAVIGATION_MENU_CREATED: "storefront.navigation.menu.created",
  NAVIGATION_MENU_UPDATED: "storefront.navigation.menu.updated",
  NAVIGATION_MENU_PUBLISHED: "storefront.navigation.menu.published",

  // Routing
  ROUTE_CREATED: "storefront.route.created",
  ROUTE_UPDATED: "storefront.route.updated",
  ROUTE_DELETED: "storefront.route.deleted",

  // SEO
  SEO_PROFILE_CREATED: "storefront.seo.profile.created",
  SEO_PROFILE_UPDATED: "storefront.seo.profile.updated",
  REDIRECT_CREATED: "storefront.redirect.created",
  REDIRECT_DELETED: "storefront.redirect.deleted",

  // Preview & Publishing
  PREVIEW_SESSION_CREATED: "storefront.preview.session.created",
  PREVIEW_SESSION_REVOKED: "storefront.preview.session.revoked",
  PUBLISH_JOB_STARTED: "storefront.publish.job.started",
  PUBLISH_JOB_COMPLETED: "storefront.publish.job.completed",
  PUBLISH_JOB_FAILED: "storefront.publish.job.failed",
} as const;
