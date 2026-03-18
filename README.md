# Africa Sokoni Commerce Platform

Multi-tenant commerce platform for africasokoni.co.ke built on Cloudflare Workers, D1, KV, R2, Queues, Better Auth, and Next.js dashboards.

## Production Defaults

- Base platform domain: `africasokoni.co.ke`
- Tenant host pattern: `{tenant}.africasokoni.co.ke`
- Primary seeded currency: `KES`
- Gateway worker service: `arch-gateway`

## Workspace Layout

- `apps/gateway`: public API gateway, tenant resolution, auth guard, OpenAPI, Swagger UI
- `apps/auth-worker`: Better Auth worker and bootstrap endpoints
- `apps/tenant-worker`: tenant onboarding, infrastructure provisioning, domain mapping
- `apps/*-worker`: domain services for catalog, orders, vendors, ledger, auth, tenancy
- `apps/storefront`, `apps/admin-dashboard`, `apps/vendor-dashboard`: Next.js applications
- `packages/infrastructure-sdk`: Cloudflare API managers for D1, KV, R2, Queues, and worker domains
- `tooling/scripts`: migrations, seeds, and Cloudflare provisioning helpers

## Quick Start

1. Install dependencies.

```bash
pnpm install
```

2. Provision or reuse the shared Cloudflare platform resources and sync the worker configs.

```bash
CLOUDFLARE_ACCOUNT_ID=... \
CLOUDFLARE_API_TOKEN=... \
pnpm provision:platform
```

This command creates or reuses:

- the shared platform D1 database `arch-platform-global`
- the shared platform KV namespace `arch-platform-config`

It also writes the resolved IDs into:

- `apps/auth-worker/wrangler.jsonc`
- `apps/gateway/wrangler.jsonc`
- `apps/tenant-worker/wrangler.jsonc`
- `apps/ledger-worker/wrangler.jsonc`

3. Set worker secrets.

```bash
pnpm dlx wrangler secret put INTERNAL_BOOTSTRAP_SECRET --config apps/auth-worker/wrangler.jsonc
pnpm dlx wrangler secret put INTERNAL_BOOTSTRAP_SECRET --config apps/tenant-worker/wrangler.jsonc
pnpm dlx wrangler secret put CLOUDFLARE_API_TOKEN --config apps/tenant-worker/wrangler.jsonc
pnpm dlx wrangler secret put BETTER_AUTH_SECRET --config apps/auth-worker/wrangler.jsonc
```

4. Run verification.

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

5. Deploy the workers and frontends.

```bash
pnpm dlx wrangler deploy --config apps/auth-worker/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/tenant-worker/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/gateway/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/catalog-worker/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/order-worker/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/vendor-worker/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/ledger-worker/wrangler.jsonc
```

## Automated Provisioning

Tenant onboarding now provisions or reuses the following Cloudflare resources programmatically:

- D1 database
- KV namespace
- R2 bucket
- Queue
- Gateway worker domain mapping for `*.africasokoni.co.ke`

Provisioning uses deterministic names based on tenant slug and tenant ID so retries can safely reuse existing resources.

## Cloudflare Token Permissions

Use a scoped API token for the tenant worker and the platform provisioning script. The practical minimum for this repo is:

- Account: `D1:Edit`
- Account: `Workers KV Storage:Edit`
- Account: `R2:Edit`
- Account: `Queues:Edit`
- Account: `Workers Scripts:Edit`
- Zone: `DNS:Edit`
- Zone: `Workers Routes:Edit`
- Zone: `Zone:Read`

If you want read-only troubleshooting from automation, add `Workers Scripts:Read`.

## CI/CD

GitHub Actions now provides:

- CI on pushes and pull requests targeting `main` and `staging`
- staging deployment on pushes to `staging`
- production deployment on pushes to `main`

The deployment workflows provision shared platform resources, synchronize worker and frontend runtime secrets, run migrations, deploy Workers, and deploy the three Next.js apps via OpenNext on Cloudflare Workers.

Configure these GitHub Environment secrets for both `staging` and `production`:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `BETTER_AUTH_SECRET`
- `INTERNAL_BOOTSTRAP_SECRET`
- optional social provider secrets such as `BETTER_AUTH_GOOGLE_CLIENT_ID`, `BETTER_AUTH_GOOGLE_CLIENT_SECRET`, `BETTER_AUTH_FACEBOOK_CLIENT_ID`, and `BETTER_AUTH_FACEBOOK_CLIENT_SECRET`
- optional `PHONE_OTP_WEBHOOK_URL`

Configure these GitHub Environment variables:

- `AUTH_WORKER_URL`
- `AUTH_WORKER_INTERNAL_URL`
- `TENANT_WORKER_INTERNAL_URL`
- optional `BETTER_AUTH_TRUSTED_ORIGINS`
- optional `BETTER_AUTH_COOKIE_DOMAIN`

## Runtime Configuration

Important worker variables:

- `PLATFORM_BASE_DOMAIN=africasokoni.co.ke`
- `GATEWAY_WORKER_SERVICE=arch-gateway`
- `CLOUDFLARE_ACCOUNT_ID=<account id>`
- `CLOUDFLARE_API_TOKEN=<scoped token>`
- `INTERNAL_BOOTSTRAP_SECRET=<shared secret between tenant-worker and auth-worker>`

## API Docs

- Gateway OpenAPI and Swagger reflect `africasokoni.co.ke` tenant hosts and `KES` examples.
- Storefront Swagger metadata is branded for Africa Sokoni.

## Seed Defaults

- Storefront demo domains are seeded under `*.africasokoni.co.ke`.
- Storefront and ledger defaults use `KES` as the primary production currency example.

## Related Docs

- `PRODUCTION_ENABLEMENT_RUNBOOK.md`
- `IMPLEMENTATION_RECONCILIATION.md`
- `maker-checker.md`