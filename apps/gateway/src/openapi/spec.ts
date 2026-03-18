import type { OpenAPIV3 } from "../openapi/types";

const bearerAuth: OpenAPIV3.SecuritySchemeObject = {
  type: "http",
  scheme: "bearer",
  bearerFormat: "Session Token",
  description:
    "Platform-issued Better Auth session token. Include as `Authorization: Bearer <token>`. " +
    "The gateway verifies the session token via the Auth Worker before proxying to protected services."
};

const tenantHeader: OpenAPIV3.ParameterObject = {
  name: "Host",
  in: "header",
  required: true,
  description:
    "Tenant is resolved from the request hostname (e.g. `tenant-a.africasokoni.co.ke`). " +
    "The gateway resolves the tenant context automatically.",
  schema: { type: "string", example: "tenant-a.africasokoni.co.ke" }
};

const ulidSchema = (description: string, example = "01JPGGGF0K8C9Q8D6Q8R7F7A1S"): OpenAPIV3.SchemaObject => ({
  type: "string",
  pattern: "^[0-9A-HJKMNP-TV-Z]{26}$",
  example,
  description
});

// ---------------------------------------------------------------------------
// Shared schemas
// ---------------------------------------------------------------------------

const ApiErrorSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["success", "error"],
  properties: {
    success: { type: "boolean", enum: [false] },
    error: {
      type: "object",
      required: ["code", "message"],
      properties: {
        code: { type: "string", example: "NOT_FOUND" },
        message: { type: "string", example: "Resource not found" },
        details: {
          type: "object",
          additionalProperties: true,
          nullable: true
        }
      }
    }
  }
};

const PaginationMetaSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    page: { type: "integer", example: 1 },
    pageSize: { type: "integer", example: 20 },
    totalItems: { type: "integer", example: 100 },
    totalPages: { type: "integer", example: 5 }
  }
};

const AuthTokenPayloadSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["sub", "sid", "exp", "iat", "orgId", "tenantId", "platformRole", "tenantRole", "permissions"],
  properties: {
    sub: { type: "string", description: "Subject / user ID" },
    sid: { type: "string", description: "Session ID" },
    exp: { type: "integer", description: "Expiration (epoch seconds)" },
    iat: { type: "integer", description: "Issued at (epoch seconds)" },
    orgId: { type: "string", nullable: true, description: "Active organization or tenant identifier" },
    tenantId: { type: "string", nullable: true, description: "Tenant context" },
    platformRole: {
      type: "string",
      nullable: true,
      enum: ["PLATFORM_ADMIN"],
      description: "Platform-level role"
    },
    tenantRole: {
      type: "string",
      nullable: true,
      enum: ["TENANT_ADMIN", "VENDOR_OWNER", "VENDOR_STAFF", "CUSTOMER"],
      description: "Tenant-level role"
    },
    permissions: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "manage:tenants",
          "manage:tenant-config",
          "manage:vendors",
          "manage:products",
          "manage:orders",
          "view:ledger",
          "manage:ledger"
        ]
      }
    }
  }
};

const ProductResponseSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["productId", "title", "slug", "status"],
  properties: {
    productId: { type: "string", format: "uuid" },
    title: { type: "string", example: "Wireless Headphones" },
    slug: { type: "string", example: "wireless-headphones" },
    status: { type: "string", enum: ["DRAFT", "PUBLISHED", "ARCHIVED"] }
  }
};

const OrderResponseSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["orderId", "status", "totalAmountCents"],
  properties: {
    orderId: { type: "string", format: "uuid" },
    status: {
      type: "string",
      enum: ["PENDING", "CONFIRMED", "FULFILLED", "CANCELLED", "REFUNDED"]
    },
    totalAmountCents: { type: "integer", example: 4999 },
    currencyCode: { type: "string", example: "KES" }
  }
};

const VendorResponseSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["vendorId", "displayName", "status"],
  properties: {
    vendorId: { type: "string", format: "uuid" },
    displayName: { type: "string", example: "Acme Electronics" },
    status: { type: "string", enum: ["PENDING", "APPROVED", "SUSPENDED"] }
  }
};

const TenantResponseSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["tenantId", "tenantSlug", "tenantDomain"],
  properties: {
    tenantId: ulidSchema("ULID generated for the tenant during onboarding."),
    tenantSlug: { type: "string", example: "tenant-a" },
    tenantDomain: { type: "string", example: "tenant-a.africasokoni.co.ke" },
    displayName: { type: "string", example: "Tenant A" },
    status: { type: "string", enum: ["ACTIVE", "SUSPENDED", "PROVISIONING"] },
    sentryDsn: { type: "string", nullable: true }
  }
};

const JournalEntryResponseSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["journalEntryId"],
  properties: {
    journalEntryId: { type: "string", format: "uuid" }
  }
};

const LedgerResponseSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["ledgerId", "name"],
  properties: {
    ledgerId: { type: "string", format: "uuid" },
    name: { type: "string", example: "Main Ledger" }
  }
};

const AccountBalanceSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["accountId", "balanceCents"],
  properties: {
    accountId: { type: "string", format: "uuid" },
    balanceCents: { type: "integer", example: 150000 }
  }
};

const CategoryResponseSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["categoryId", "name", "slug"],
  properties: {
    categoryId: { type: "string", format: "uuid" },
    name: { type: "string", example: "Electronics" },
    slug: { type: "string", example: "electronics" },
    parentCategoryId: { type: "string", format: "uuid", nullable: true }
  }
};

const RefundResponseSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["refundId", "amountCents", "reason"],
  properties: {
    refundId: { type: "string", format: "uuid" },
    amountCents: { type: "integer", example: 1999 },
    reason: { type: "string", example: "Defective item" }
  }
};

const HealthResponseSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["service", "status"],
  properties: {
    service: { type: "string" },
    status: { type: "string", enum: ["ok"] }
  }
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const successWrap = (dataSchema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject, withMeta = false): OpenAPIV3.SchemaObject => {
  const base: OpenAPIV3.SchemaObject = {
    type: "object",
    required: ["success", "data"],
    properties: {
      success: { type: "boolean", enum: [true] },
      data: dataSchema
    }
  };
  if (withMeta) {
    base.properties = { ...base.properties, meta: { $ref: "#/components/schemas/PaginationMeta" } };
  }
  return base;
};

const jsonBody = (schema: OpenAPIV3.SchemaObject): OpenAPIV3.RequestBodyObject => ({
  required: true,
  content: { "application/json": { schema } }
});

const jsonResponse = (description: string, schema: OpenAPIV3.SchemaObject): OpenAPIV3.ResponseObject => ({
  description,
  content: { "application/json": { schema } }
});

const errorResponses = (codes: number[]): Record<string, OpenAPIV3.ResponseObject> => {
  const map: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized – missing or invalid bearer token",
    403: "Forbidden – insufficient permissions or tenant mismatch",
    404: "Not Found",
    429: "Rate Limited – too many requests (120 req/min per tenant+IP)",
    500: "Internal Server Error"
  };
  const apiErrorRef: OpenAPIV3.ReferenceObject = { $ref: "#/components/schemas/ApiError" };
  const out: Record<string, OpenAPIV3.ResponseObject> = {};
  for (const c of codes) {
    out[String(c)] = jsonResponse(map[c] ?? `Error ${c}`, apiErrorRef as unknown as OpenAPIV3.SchemaObject);
  }
  return out;
};

// ---------------------------------------------------------------------------
// OpenAPI Document
// ---------------------------------------------------------------------------

export const openApiSpec: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "Africa Sokoni Commerce Platform API",
    version: "0.1.0",
    description:
      "Multi-tenant SaaS commerce platform API. " +
      "Requests are routed through an API Gateway which handles tenant resolution, " +
      "rate limiting, CORS, and session authentication before proxying to isolated microservices.\n\n" +
      "## Authentication\n" +
      "Protected routes require a **Better Auth session token** in the `Authorization: Bearer <token>` header, " +
      "or a first-party session cookie for browser-oriented auth APIs. The gateway validates bearer tokens via the Auth Worker.\n\n" +
      "## Multi-Tenancy\n" +
      "Tenant context is resolved from the request hostname (e.g. `tenant-a.africasokoni.co.ke`). " +
      "Each tenant has isolated databases, caches, and event queues.\n\n" +
      "## Rate Limiting\n" +
      "All endpoints are rate-limited at **120 requests per 60 seconds** per tenant+IP combination. " +
      "Responses include `x-rate-limit-remaining` and `x-rate-limit-reset-ms` headers.\n\n" +
      "## Response Envelope\n" +
      "All responses follow a standard envelope: `{success, data}` on success or `{success, error}` on failure."
  },
  servers: [
    { url: "https://{tenant}.africasokoni.co.ke", description: "Production", variables: { tenant: { default: "demo" } } },
    { url: "http://localhost:8787", description: "Local development" }
  ],
  tags: [
    { name: "Auth", description: "Authentication, session inspection, and token verification" },
    { name: "Catalog", description: "Product catalog management (requires auth)" },
    { name: "Storefront", description: "Public storefront endpoints (read-only catalog)" },
    { name: "Orders", description: "Order lifecycle management (requires auth)" },
    { name: "Vendors", description: "Vendor onboarding and management (requires auth)" },
    { name: "Admin", description: "Platform administration and tenant provisioning (requires auth)" },
    { name: "Ledger", description: "Double-entry accounting ledger (requires auth)" }
  ],
  paths: {
    // =====================================================================
    // AUTH
    // =====================================================================
    "/auth/health": {
      get: {
        operationId: "authHealth",
        tags: ["Auth"],
        summary: "Auth service health check",
        responses: {
          "200": jsonResponse("Healthy", successWrap(HealthResponseSchema))
        }
      }
    },
    "/auth/internal/verify-token": {
      post: {
        operationId: "verifyToken",
        tags: ["Auth"],
        summary: "Verify a Better Auth session token",
        description:
          "Internal endpoint used by the gateway's auth guard middleware. " +
          "Validates a Better Auth session token and normalizes it into the platform authorization payload.",
        requestBody: jsonBody({
          type: "object",
          required: ["token"],
          properties: {
            token: { type: "string", description: "Better Auth session token" },
            tenantId: { type: "string", nullable: true, description: "Optional tenant to verify against" }
          }
        }),
        responses: {
          "200": jsonResponse("Token verified", successWrap({
            type: "object",
            required: ["subject", "payload"],
            properties: {
              subject: { type: "string" },
              payload: { $ref: "#/components/schemas/AuthTokenPayload" }
            }
          })),
          ...errorResponses([400, 401, 404])
        }
      }
    },
    "/auth/api/client/providers": {
      get: {
        operationId: "getAuthProviders",
        tags: ["Auth"],
        summary: "Get client auth capabilities",
        description: "Returns the enabled credential strategies, social providers, and session transports exposed by the auth worker.",
        responses: {
          "200": jsonResponse("Auth providers", successWrap({
            type: "object",
            required: ["credentialStrategies", "socialProviders", "sessionTransports", "organizationEnabled", "adminEnabled"],
            properties: {
              credentialStrategies: {
                type: "array",
                items: { type: "string", enum: ["email", "username", "phone"] }
              },
              socialProviders: {
                type: "array",
                items: { type: "string", enum: ["google", "facebook"] }
              },
              sessionTransports: {
                type: "array",
                items: { type: "string", enum: ["cookie", "bearer"] }
              },
              organizationEnabled: { type: "boolean" },
              adminEnabled: { type: "boolean" }
            }
          }))
        }
      }
    },
    "/auth/api/client/session": {
      get: {
        operationId: "getClientSession",
        tags: ["Auth"],
        summary: "Resolve the current client session",
        description:
          "Resolves the current user session from a first-party session cookie or bearer token and returns normalized platform authorization data.",
        parameters: [
          { name: "tenantId", in: "query", required: false, schema: { type: "string" }, description: "Optional tenant context override" }
        ],
        responses: {
          "200": jsonResponse("Session state", successWrap({
            type: "object",
            required: ["authenticated", "session", "user", "memberships", "authorization"],
            properties: {
              authenticated: { type: "boolean" },
              session: {
                type: "object",
                nullable: true,
                required: ["sessionId", "userId", "expiresAt", "issuedAt"],
                properties: {
                  sessionId: { type: "string" },
                  userId: { type: "string" },
                  expiresAt: { type: "integer" },
                  issuedAt: { type: "integer" }
                }
              },
              user: {
                type: "object",
                nullable: true,
                required: ["id", "email", "name", "image"],
                properties: {
                  id: { type: "string" },
                  email: { type: "string", nullable: true },
                  name: { type: "string", nullable: true },
                  image: { type: "string", nullable: true }
                }
              },
              memberships: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "tenantId", "userId", "role"],
                  properties: {
                    id: { type: "string" },
                    tenantId: { type: "string" },
                    userId: { type: "string" },
                    role: { type: "string", enum: ["PLATFORM_ADMIN", "TENANT_ADMIN", "VENDOR_OWNER", "VENDOR_STAFF", "CUSTOMER"] }
                  }
                }
              },
              authorization: {
                type: "object",
                nullable: true,
                required: ["sub", "sid", "exp", "iat", "orgId", "tenantId", "platformRole", "tenantRole", "permissions"],
                properties: {
                  sub: { type: "string" },
                  sid: { type: "string" },
                  exp: { type: "integer" },
                  iat: { type: "integer" },
                  orgId: { type: "string", nullable: true },
                  tenantId: { type: "string", nullable: true },
                  platformRole: { type: "string", nullable: true, enum: ["PLATFORM_ADMIN"] },
                  tenantRole: {
                    type: "string",
                    nullable: true,
                    enum: ["TENANT_ADMIN", "VENDOR_OWNER", "VENDOR_STAFF", "CUSTOMER"]
                  },
                  permissions: {
                    type: "array",
                    items: {
                      type: "string",
                      enum: [
                        "manage:tenants",
                        "manage:tenant-config",
                        "manage:vendors",
                        "manage:products",
                        "manage:orders",
                        "view:ledger",
                        "manage:ledger"
                      ]
                    }
                  }
                }
              }
            }
          }))
        }
      }
    },
    "/auth/api/client/me": {
      get: {
        operationId: "getClientProfile",
        tags: ["Auth"],
        summary: "Get the authenticated client profile",
        description: "Returns the authenticated user, memberships, and normalized authorization payload.",
        parameters: [
          { name: "tenantId", in: "query", required: false, schema: { type: "string" }, description: "Optional tenant context override" }
        ],
        responses: {
          "200": jsonResponse("Authenticated profile", successWrap({
            type: "object",
            required: ["user", "memberships", "authorization"],
            properties: {
              user: {
                type: "object",
                required: ["id", "email", "name", "image"],
                properties: {
                  id: { type: "string" },
                  email: { type: "string", nullable: true },
                  name: { type: "string", nullable: true },
                  image: { type: "string", nullable: true }
                }
              },
              memberships: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "tenantId", "userId", "role"],
                  properties: {
                    id: { type: "string" },
                    tenantId: { type: "string" },
                    userId: { type: "string" },
                    role: { type: "string", enum: ["PLATFORM_ADMIN", "TENANT_ADMIN", "VENDOR_OWNER", "VENDOR_STAFF", "CUSTOMER"] }
                  }
                }
              },
              authorization: { $ref: "#/components/schemas/AuthTokenPayload" }
            }
          })),
          ...errorResponses([401])
        }
      }
    },
    "/auth/internal/users/{userId}/profile": {
      get: {
        operationId: "getUserProfile",
        tags: ["Auth"],
        summary: "Get user profile by user ID",
        parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": jsonResponse("User profile", successWrap({
            type: "object",
            required: ["userId", "email", "memberships"],
            properties: {
              userId: { type: "string" },
              email: { type: "string", format: "email" },
              memberships: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    tenantId: { type: "string" },
                    role: { type: "string" }
                  }
                }
              }
            }
          })),
          ...errorResponses([404])
        }
      }
    },

    // =====================================================================
    // CATALOG (authenticated)
    // =====================================================================
    "/catalog/health": {
      get: {
        operationId: "catalogHealth",
        tags: ["Catalog"],
        summary: "Catalog service health check",
        responses: { "200": jsonResponse("Healthy", successWrap(HealthResponseSchema)) }
      }
    },
    "/catalog/products": {
      post: {
        operationId: "createProduct",
        tags: ["Catalog"],
        summary: "Create a new product",
        security: [{ BearerAuth: [] }],
        requestBody: jsonBody({
          type: "object",
          required: ["tenantId", "vendorId", "title", "slug"],
          properties: {
            tenantId: { type: "string" },
            vendorId: { type: "string" },
            title: { type: "string", example: "Wireless Headphones" },
            slug: { type: "string", example: "wireless-headphones" }
          }
        }),
        responses: {
          "201": jsonResponse("Product created", successWrap({ $ref: "#/components/schemas/ProductResponse" })),
          ...errorResponses([400, 401, 403, 429])
        }
      },
      get: {
        operationId: "listProducts",
        tags: ["Catalog"],
        summary: "List or search products",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "q", in: "query", schema: { type: "string" }, description: "Search query" }
        ],
        responses: {
          "200": jsonResponse("Product list", successWrap({
            type: "array",
            items: { $ref: "#/components/schemas/ProductResponse" }
          }, true)),
          ...errorResponses([401, 403, 429])
        }
      }
    },
    "/catalog/products/{productId}": {
      get: {
        operationId: "getProduct",
        tags: ["Catalog"],
        summary: "Get a product by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": jsonResponse("Product details", successWrap({ $ref: "#/components/schemas/ProductResponse" })),
          ...errorResponses([401, 403, 404, 429])
        }
      },
      patch: {
        operationId: "updateProduct",
        tags: ["Catalog"],
        summary: "Update a product",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: jsonBody({
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" }
          }
        }),
        responses: {
          "200": jsonResponse("Product updated", successWrap({ $ref: "#/components/schemas/ProductResponse" })),
          ...errorResponses([400, 401, 403, 404, 429])
        }
      }
    },
    "/catalog/products/{productId}/publish": {
      post: {
        operationId: "publishProduct",
        tags: ["Catalog"],
        summary: "Publish a draft product",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": jsonResponse("Product published", successWrap({ $ref: "#/components/schemas/ProductResponse" })),
          ...errorResponses([400, 401, 403, 404, 429])
        }
      }
    },
    "/catalog/categories": {
      post: {
        operationId: "createCategory",
        tags: ["Catalog"],
        summary: "Create a product category",
        security: [{ BearerAuth: [] }],
        requestBody: jsonBody({
          type: "object",
          required: ["name", "slug"],
          properties: {
            name: { type: "string", example: "Electronics" },
            slug: { type: "string", example: "electronics" },
            parentCategoryId: { type: "string", format: "uuid", nullable: true }
          }
        }),
        responses: {
          "201": jsonResponse("Category created", successWrap({ $ref: "#/components/schemas/CategoryResponse" })),
          ...errorResponses([400, 401, 403, 429])
        }
      },
      get: {
        operationId: "listCategories",
        tags: ["Catalog"],
        summary: "List all categories",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": jsonResponse("Category list", successWrap({
            type: "array",
            items: { $ref: "#/components/schemas/CategoryResponse" }
          })),
          ...errorResponses([401, 403, 429])
        }
      }
    },

    // =====================================================================
    // STOREFRONT (public)
    // =====================================================================
    "/storefront/health": {
      get: {
        operationId: "storefrontHealth",
        tags: ["Storefront"],
        summary: "Storefront service health check",
        responses: { "200": jsonResponse("Healthy", successWrap(HealthResponseSchema)) }
      }
    },
    "/storefront/products": {
      get: {
        operationId: "storefrontListProducts",
        tags: ["Storefront"],
        summary: "Browse published products (public)",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" }, description: "Search query" }
        ],
        responses: {
          "200": jsonResponse("Product list", successWrap({
            type: "array",
            items: { $ref: "#/components/schemas/ProductResponse" }
          }, true)),
          ...errorResponses([429])
        }
      }
    },
    "/storefront/products/{productId}": {
      get: {
        operationId: "storefrontGetProduct",
        tags: ["Storefront"],
        summary: "Get product details (public)",
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": jsonResponse("Product details", successWrap({ $ref: "#/components/schemas/ProductResponse" })),
          ...errorResponses([404, 429])
        }
      }
    },
    "/storefront/categories": {
      get: {
        operationId: "storefrontListCategories",
        tags: ["Storefront"],
        summary: "Browse product categories (public)",
        responses: {
          "200": jsonResponse("Category list", successWrap({
            type: "array",
            items: { $ref: "#/components/schemas/CategoryResponse" }
          })),
          ...errorResponses([429])
        }
      }
    },

    // =====================================================================
    // ORDERS (authenticated)
    // =====================================================================
    "/orders/health": {
      get: {
        operationId: "ordersHealth",
        tags: ["Orders"],
        summary: "Order service health check",
        responses: { "200": jsonResponse("Healthy", successWrap(HealthResponseSchema)) }
      }
    },
    "/orders/orders": {
      post: {
        operationId: "placeOrder",
        tags: ["Orders"],
        summary: "Place a new order",
        security: [{ BearerAuth: [] }],
        requestBody: jsonBody({
          type: "object",
          required: ["tenantId", "customerId", "currencyCode", "totalAmountCents"],
          properties: {
            tenantId: { type: "string" },
            customerId: { type: "string" },
            currencyCode: { type: "string", example: "KES" },
            totalAmountCents: { type: "integer", example: 4999 }
          }
        }),
        responses: {
          "201": jsonResponse("Order placed", successWrap({ $ref: "#/components/schemas/OrderResponse" })),
          ...errorResponses([400, 401, 403, 429])
        }
      }
    },
    "/orders/orders/{orderId}": {
      get: {
        operationId: "getOrder",
        tags: ["Orders"],
        summary: "Get order details",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": jsonResponse("Order details", successWrap({ $ref: "#/components/schemas/OrderResponse" })),
          ...errorResponses([401, 403, 404, 429])
        }
      }
    },
    "/orders/orders/{orderId}/confirm-payment": {
      post: {
        operationId: "confirmOrderPayment",
        tags: ["Orders"],
        summary: "Confirm payment for an order",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: jsonBody({
          type: "object",
          required: ["paymentReference"],
          properties: {
            paymentReference: { type: "string", description: "Payment gateway reference" }
          }
        }),
        responses: {
          "200": jsonResponse("Payment confirmed", successWrap({ $ref: "#/components/schemas/OrderResponse" })),
          ...errorResponses([400, 401, 403, 404, 429])
        }
      }
    },
    "/orders/orders/{orderId}/fulfill": {
      post: {
        operationId: "fulfillOrder",
        tags: ["Orders"],
        summary: "Mark order as fulfilled",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: jsonBody({
          type: "object",
          required: ["trackingNumber"],
          properties: {
            trackingNumber: { type: "string", example: "1Z999AA10123456784" }
          }
        }),
        responses: {
          "200": jsonResponse("Order fulfilled", successWrap({ $ref: "#/components/schemas/OrderResponse" })),
          ...errorResponses([400, 401, 403, 404, 429])
        }
      }
    },
    "/orders/orders/{orderId}/cancel": {
      post: {
        operationId: "cancelOrder",
        tags: ["Orders"],
        summary: "Cancel an order",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: jsonBody({
          type: "object",
          required: ["reason"],
          properties: {
            reason: { type: "string", example: "Customer requested cancellation" }
          }
        }),
        responses: {
          "200": jsonResponse("Order cancelled", successWrap({ $ref: "#/components/schemas/OrderResponse" })),
          ...errorResponses([400, 401, 403, 404, 429])
        }
      }
    },
    "/orders/orders/{orderId}/refunds": {
      post: {
        operationId: "createRefund",
        tags: ["Orders"],
        summary: "Issue a refund for an order",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: jsonBody({
          type: "object",
          required: ["amountCents", "reason"],
          properties: {
            amountCents: { type: "integer", example: 1999 },
            reason: { type: "string", example: "Defective item" }
          }
        }),
        responses: {
          "201": jsonResponse("Refund created", successWrap({ $ref: "#/components/schemas/RefundResponse" })),
          ...errorResponses([400, 401, 403, 404, 429])
        }
      }
    },
    "/orders/customers/{customerId}/orders": {
      get: {
        operationId: "listCustomerOrders",
        tags: ["Orders"],
        summary: "List orders for a customer",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "customerId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": jsonResponse("Customer orders", successWrap({
            type: "array",
            items: { $ref: "#/components/schemas/OrderResponse" }
          })),
          ...errorResponses([401, 403, 429])
        }
      }
    },
    "/orders/vendors/{vendorId}/orders": {
      get: {
        operationId: "listVendorOrders",
        tags: ["Orders"],
        summary: "List orders for a vendor",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "vendorId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": jsonResponse("Vendor orders", successWrap({
            type: "array",
            items: { $ref: "#/components/schemas/OrderResponse" }
          })),
          ...errorResponses([401, 403, 429])
        }
      }
    },

    // =====================================================================
    // VENDORS (authenticated)
    // =====================================================================
    "/vendors/health": {
      get: {
        operationId: "vendorsHealth",
        tags: ["Vendors"],
        summary: "Vendor service health check",
        responses: { "200": jsonResponse("Healthy", successWrap(HealthResponseSchema)) }
      }
    },
    "/vendors/vendors": {
      post: {
        operationId: "registerVendor",
        tags: ["Vendors"],
        summary: "Register a new vendor",
        security: [{ BearerAuth: [] }],
        requestBody: jsonBody({
          type: "object",
          required: ["tenantId", "displayName", "businessName"],
          properties: {
            tenantId: { type: "string" },
            displayName: { type: "string", example: "Acme Electronics" },
            businessName: { type: "string", example: "Acme Electronics LLC" }
          }
        }),
        responses: {
          "201": jsonResponse("Vendor registered", successWrap({ $ref: "#/components/schemas/VendorResponse" })),
          ...errorResponses([400, 401, 403, 429])
        }
      }
    },
    "/vendors/vendors/{vendorId}": {
      get: {
        operationId: "getVendor",
        tags: ["Vendors"],
        summary: "Get vendor details",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "vendorId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": jsonResponse("Vendor details", successWrap({ $ref: "#/components/schemas/VendorResponse" })),
          ...errorResponses([401, 403, 404, 429])
        }
      }
    },
    "/vendors/vendors/{vendorId}/approve": {
      post: {
        operationId: "approveVendor",
        tags: ["Vendors"],
        summary: "Approve a pending vendor",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "vendorId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: jsonBody({
          type: "object",
          required: ["approvedBy"],
          properties: {
            approvedBy: { type: "string", description: "Admin user ID who approved" }
          }
        }),
        responses: {
          "200": jsonResponse("Vendor approved", successWrap({ $ref: "#/components/schemas/VendorResponse" })),
          ...errorResponses([400, 401, 403, 404, 429])
        }
      }
    },
    "/vendors/vendors/{vendorId}/suspend": {
      post: {
        operationId: "suspendVendor",
        tags: ["Vendors"],
        summary: "Suspend an active vendor",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "vendorId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: jsonBody({
          type: "object",
          required: ["reason"],
          properties: {
            reason: { type: "string", example: "Policy violation" }
          }
        }),
        responses: {
          "200": jsonResponse("Vendor suspended", successWrap({ $ref: "#/components/schemas/VendorResponse" })),
          ...errorResponses([400, 401, 403, 404, 429])
        }
      }
    },
    "/vendors/vendors/{vendorId}/payout-config": {
      post: {
        operationId: "configureVendorPayout",
        tags: ["Vendors"],
        summary: "Configure vendor payout settings",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "vendorId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: jsonBody({
          type: "object",
          required: ["payoutSchedule", "minimumPayoutAmountCents"],
          properties: {
            payoutSchedule: { type: "string", enum: ["WEEKLY", "BIWEEKLY", "MONTHLY"], example: "MONTHLY" },
            minimumPayoutAmountCents: { type: "integer", example: 5000 }
          }
        }),
        responses: {
          "200": jsonResponse("Payout config updated", successWrap({
            type: "object",
            properties: {
              vendorId: { type: "string" },
              payoutSchedule: { type: "string" },
              minimumPayoutAmountCents: { type: "integer" }
            }
          })),
          ...errorResponses([400, 401, 403, 404, 429])
        }
      }
    },
    "/vendors/tenants/{tenantId}/vendors": {
      get: {
        operationId: "listTenantVendors",
        tags: ["Vendors"],
        summary: "List all vendors for a tenant",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "tenantId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": jsonResponse("Vendor list", successWrap({
            type: "array",
            items: { $ref: "#/components/schemas/VendorResponse" }
          })),
          ...errorResponses([401, 403, 429])
        }
      }
    },
    "/vendors/vendors/{vendorId}/analytics": {
      get: {
        operationId: "getVendorAnalytics",
        tags: ["Vendors"],
        summary: "Get vendor analytics summary",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "vendorId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": jsonResponse("Vendor analytics", successWrap({
            type: "object",
            properties: {
              totalRevenueCents: { type: "integer" },
              totalOrders: { type: "integer" },
              averageOrderValueCents: { type: "integer" }
            }
          })),
          ...errorResponses([401, 403, 404, 429])
        }
      }
    },
    "/vendors/vendors/{vendorId}/payout-history": {
      get: {
        operationId: "getVendorPayoutHistory",
        tags: ["Vendors"],
        summary: "Get vendor payout history",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "vendorId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": jsonResponse("Payout history", successWrap({
            type: "array",
            items: {
              type: "object",
              properties: {
                payoutId: { type: "string" },
                amountCents: { type: "integer" },
                status: { type: "string", enum: ["PENDING", "COMPLETED", "FAILED"] },
                paidAt: { type: "string", format: "date-time", nullable: true }
              }
            }
          })),
          ...errorResponses([401, 403, 404, 429])
        }
      }
    },

    // =====================================================================
    // ADMIN / TENANT MANAGEMENT (authenticated)
    // =====================================================================
    "/admin/health": {
      get: {
        operationId: "adminHealth",
        tags: ["Admin"],
        summary: "Tenant admin service health check",
        responses: { "200": jsonResponse("Healthy", successWrap(HealthResponseSchema)) }
      }
    },
    "/admin/tenants": {
      post: {
        operationId: "provisionTenant",
        tags: ["Admin"],
        summary: "Onboard a new tenant",
        description:
          "Creates a tenant with a ULID identifier, provisions its baseline infrastructure footprint, " +
          "bootstraps Better Auth users, and seeds default vendor/storefront records.",
        security: [{ BearerAuth: [] }],
        requestBody: jsonBody({
          type: "object",
          required: ["tenantSlug", "displayName", "primaryDomain", "users"],
          properties: {
            tenantId: {
              ...ulidSchema("Optional explicit ULID. If omitted, the tenant worker generates one."),
              nullable: true
            },
            tenantSlug: { type: "string", example: "my-store" },
            displayName: { type: "string", example: "My Store" },
            primaryDomain: { type: "string", example: "my-store.africasokoni.co.ke" },
            users: {
              type: "array",
              minItems: 2,
              items: {
                type: "object",
                required: ["role", "email", "name"],
                properties: {
                  role: {
                    type: "string",
                    enum: ["PLATFORM_ADMIN", "TENANT_ADMIN", "VENDOR_OWNER", "CUSTOMER"]
                  },
                  email: { type: "string", format: "email", example: "admin@example.com" },
                  name: { type: "string", example: "Alex Morgan" },
                  password: {
                    type: "string",
                    nullable: true,
                    description: "Optional explicit password. If omitted, onboarding generates a temporary password."
                  }
                }
              }
            }
          }
        }),
        responses: {
          "201": jsonResponse("Tenant onboarded", successWrap({
            allOf: [
              { $ref: "#/components/schemas/TenantResponse" },
              {
                type: "object",
                required: ["infrastructureReady", "seededUsers", "seededResources"],
                properties: {
                  infrastructureReady: { type: "boolean", enum: [true] },
                  seededUsers: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["role", "userId", "email", "name", "password", "temporaryPassword"],
                      properties: {
                        role: {
                          type: "string",
                          enum: ["PLATFORM_ADMIN", "TENANT_ADMIN", "VENDOR_OWNER", "CUSTOMER"]
                        },
                        userId: { type: "string", description: "Better Auth user id." },
                        email: { type: "string", format: "email" },
                        name: { type: "string" },
                        password: {
                          type: "string",
                          description: "Generated or supplied bootstrap password. Returned once at onboarding time."
                        },
                        temporaryPassword: { type: "boolean" }
                      }
                    }
                  },
                  seededResources: {
                    type: "object",
                    required: ["vendorId", "storefrontId", "domains", "infrastructure"],
                    properties: {
                      vendorId: ulidSchema("Seeded default vendor id."),
                      storefrontId: ulidSchema("Seeded default storefront id."),
                      domains: {
                        type: "array",
                        items: { type: "string" }
                      },
                      infrastructure: {
                        type: "object",
                        required: ["d1DatabaseId", "kvNamespaceId", "r2BucketName", "queueName"],
                        properties: {
                          d1DatabaseId: { type: "string" },
                          kvNamespaceId: { type: "string" },
                          r2BucketName: { type: "string" },
                          queueName: { type: "string" }
                        }
                      }
                    }
                  }
                }
              }
            ]
          })),
          ...errorResponses([400, 401, 403, 429])
        }
      }
    },
    "/admin/tenants/{tenantId}": {
      get: {
        operationId: "getTenant",
        tags: ["Admin"],
        summary: "Get tenant details",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "tenantId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": jsonResponse("Tenant details", successWrap({ $ref: "#/components/schemas/TenantResponse" })),
          ...errorResponses([401, 403, 404, 429])
        }
      }
    },
    "/admin/tenants/{tenantId}/suspend": {
      post: {
        operationId: "suspendTenant",
        tags: ["Admin"],
        summary: "Suspend a tenant",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "tenantId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: jsonBody({
          type: "object",
          required: ["reason"],
          properties: {
            reason: { type: "string", example: "Non-payment" }
          }
        }),
        responses: {
          "200": jsonResponse("Tenant suspended", successWrap({ $ref: "#/components/schemas/TenantResponse" })),
          ...errorResponses([400, 401, 403, 404, 429])
        }
      }
    },

    // =====================================================================
    // LEDGER (authenticated)
    // =====================================================================
    "/ledger/health": {
      get: {
        operationId: "ledgerHealth",
        tags: ["Ledger"],
        summary: "Ledger service health check",
        responses: { "200": jsonResponse("Healthy", successWrap(HealthResponseSchema)) }
      }
    },
    "/ledger/ledgers": {
      post: {
        operationId: "createLedger",
        tags: ["Ledger"],
        summary: "Create a new ledger",
        security: [{ BearerAuth: [] }],
        requestBody: jsonBody({
          type: "object",
          required: ["tenantId", "name"],
          properties: {
            tenantId: { type: "string" },
            name: { type: "string", example: "Main Ledger" }
          }
        }),
        responses: {
          "201": jsonResponse("Ledger created", successWrap({ $ref: "#/components/schemas/LedgerResponse" })),
          ...errorResponses([400, 401, 403, 429])
        }
      }
    },
    "/ledger/ledgers/{ledgerId}/accounts": {
      post: {
        operationId: "createLedgerAccount",
        tags: ["Ledger"],
        summary: "Create an account in a ledger",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "ledgerId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: jsonBody({
          type: "object",
          required: ["code", "name", "accountType"],
          properties: {
            code: { type: "string", example: "1000" },
            name: { type: "string", example: "Cash" },
            accountType: { type: "string", enum: ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"] }
          }
        }),
        responses: {
          "201": jsonResponse("Account created", successWrap({
            type: "object",
            required: ["accountId"],
            properties: { accountId: { type: "string", format: "uuid" } }
          })),
          ...errorResponses([400, 401, 403, 404, 429])
        }
      }
    },
    "/ledger/ledgers/{ledgerId}/journal-entries": {
      post: {
        operationId: "postJournalEntry",
        tags: ["Ledger"],
        summary: "Post a journal entry",
        description: "Creates a double-entry journal entry. Debit and credit totals must balance.",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "ledgerId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: jsonBody({
          type: "object",
          required: ["referenceType", "referenceId", "lines"],
          properties: {
            referenceType: { type: "string", example: "ORDER" },
            referenceId: { type: "string", format: "uuid" },
            lines: {
              type: "array",
              items: {
                type: "object",
                required: ["id", "journalEntryId", "accountId", "debitAmountCents", "creditAmountCents"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  journalEntryId: { type: "string", format: "uuid" },
                  accountId: { type: "string", format: "uuid" },
                  debitAmountCents: { type: "integer", example: 5000 },
                  creditAmountCents: { type: "integer", example: 0 }
                }
              }
            }
          }
        }),
        responses: {
          "201": jsonResponse("Journal entry posted", successWrap({ $ref: "#/components/schemas/JournalEntryResponse" })),
          ...errorResponses([400, 401, 403, 404, 429])
        }
      },
      get: {
        operationId: "listJournalEntries",
        tags: ["Ledger"],
        summary: "List journal entries for a ledger",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "ledgerId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": jsonResponse("Journal entries", successWrap({
            type: "array",
            items: { $ref: "#/components/schemas/JournalEntryResponse" }
          })),
          ...errorResponses([401, 403, 404, 429])
        }
      }
    },
    "/ledger/journal-entries/{journalEntryId}/reverse": {
      post: {
        operationId: "reverseJournalEntry",
        tags: ["Ledger"],
        summary: "Reverse a journal entry",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "journalEntryId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: jsonBody({
          type: "object",
          required: ["reason"],
          properties: { reason: { type: "string", example: "Order cancelled" } }
        }),
        responses: {
          "200": jsonResponse("Journal entry reversed", successWrap({
            type: "object",
            properties: {
              reversalJournalEntryId: { type: "string", format: "uuid" }
            }
          })),
          ...errorResponses([400, 401, 403, 404, 429])
        }
      }
    },
    "/ledger/ledgers/{ledgerId}/periods/{periodKey}/close": {
      post: {
        operationId: "closePeriod",
        tags: ["Ledger"],
        summary: "Close an accounting period",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "ledgerId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "periodKey", in: "path", required: true, schema: { type: "string", example: "2026-03" } }
        ],
        responses: {
          "200": jsonResponse("Period closed", successWrap({
            type: "object",
            properties: {
              periodKey: { type: "string" },
              closedAt: { type: "string", format: "date-time" }
            }
          })),
          ...errorResponses([400, 401, 403, 404, 429])
        }
      }
    },
    "/ledger/ledgers/{ledgerId}/trial-balance": {
      get: {
        operationId: "getTrialBalance",
        tags: ["Ledger"],
        summary: "Get trial balance for a ledger",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "ledgerId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "periodKey", in: "query", schema: { type: "string", example: "2026-03" }, description: "Accounting period" }
        ],
        responses: {
          "200": jsonResponse("Trial balance", successWrap({
            type: "object",
            properties: {
              periodKey: { type: "string" },
              accounts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    accountId: { type: "string" },
                    code: { type: "string" },
                    name: { type: "string" },
                    debitBalanceCents: { type: "integer" },
                    creditBalanceCents: { type: "integer" }
                  }
                }
              }
            }
          })),
          ...errorResponses([401, 403, 404, 429])
        }
      }
    },
    "/ledger/ledgers/{ledgerId}/balance-sheet": {
      get: {
        operationId: "getBalanceSheet",
        tags: ["Ledger"],
        summary: "Get balance sheet for a ledger",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "ledgerId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": jsonResponse("Balance sheet", successWrap({
            type: "object",
            properties: {
              assets: { type: "array", items: { $ref: "#/components/schemas/AccountBalance" } },
              liabilities: { type: "array", items: { $ref: "#/components/schemas/AccountBalance" } },
              equity: { type: "array", items: { $ref: "#/components/schemas/AccountBalance" } }
            }
          })),
          ...errorResponses([401, 403, 404, 429])
        }
      }
    },
    "/ledger/accounts/{accountId}/balance": {
      get: {
        operationId: "getAccountBalance",
        tags: ["Ledger"],
        summary: "Get balance for a specific account",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "accountId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": jsonResponse("Account balance", successWrap({ $ref: "#/components/schemas/AccountBalance" })),
          ...errorResponses([401, 403, 404, 429])
        }
      }
    }
  },
  components: {
    securitySchemes: {
      BearerAuth: bearerAuth
    },
    schemas: {
      ApiError: ApiErrorSchema,
      PaginationMeta: PaginationMetaSchema,
      AuthTokenPayload: AuthTokenPayloadSchema,
      ProductResponse: ProductResponseSchema,
      OrderResponse: OrderResponseSchema,
      VendorResponse: VendorResponseSchema,
      TenantResponse: TenantResponseSchema,
      LedgerResponse: LedgerResponseSchema,
      JournalEntryResponse: JournalEntryResponseSchema,
      AccountBalance: AccountBalanceSchema,
      CategoryResponse: CategoryResponseSchema,
      RefundResponse: RefundResponseSchema,
      HealthResponse: HealthResponseSchema
    },
    parameters: {
      TenantHost: tenantHeader
    }
  }
};
