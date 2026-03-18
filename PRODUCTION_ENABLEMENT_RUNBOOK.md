# Production Enablement Runbook

## 1) Prerequisites

- Node.js 22 LTS
- Corepack with pnpm 9+
- Cloudflare account hosting `africasokoni.co.ke`
- Scoped Cloudflare API token with the permissions listed below

```bash
corepack enable
corepack prepare pnpm@9 --activate
pnpm install
```

## 2) Required Cloudflare Token Scopes

Use one scoped token for both the tenant worker and the provisioning script.

- Account: `D1:Edit`
- Account: `Workers KV Storage:Edit`
- Account: `R2:Edit`
- Account: `Queues:Edit`
- Account: `Workers Scripts:Edit`
- Zone: `DNS:Edit`
- Zone: `Workers Routes:Edit`
- Zone: `Zone:Read`

Optional:

- Account: `Workers Scripts:Read`

## 3) Provision Shared Platform Resources

The shared platform D1 and KV resources are no longer a manual step.

```bash
export CLOUDFLARE_ACCOUNT_ID=<account-id>
export CLOUDFLARE_API_TOKEN=<scoped-token>

pnpm provision:platform
```

This command creates or reuses:

- D1 database `arch-platform-global`
- KV namespace `arch-platform-config`

It also synchronizes those IDs into:

- `apps/auth-worker/wrangler.jsonc`
- `apps/gateway/wrangler.jsonc`
- `apps/tenant-worker/wrangler.jsonc`
- `apps/ledger-worker/wrangler.jsonc`

## 4) Configure Runtime Variables

Set these variables in production configs:

- `PLATFORM_BASE_DOMAIN=africasokoni.co.ke`
- `GATEWAY_WORKER_SERVICE=arch-gateway`
- `CLOUDFLARE_ACCOUNT_ID=<account-id>`
- `PLATFORM_SENTRY_DSN=<dsn or blank placeholder>`

For tenant onboarding automation, `apps/tenant-worker/wrangler.jsonc` must have:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `PLATFORM_BASE_DOMAIN`
- `GATEWAY_WORKER_SERVICE`
- optional `GATEWAY_WORKER_ENVIRONMENT`

## 5) Configure Secrets

Required secrets:

- `BETTER_AUTH_SECRET` on `apps/auth-worker`
- `INTERNAL_BOOTSTRAP_SECRET` on `apps/auth-worker`
- `INTERNAL_BOOTSTRAP_SECRET` on `apps/tenant-worker`
- `CLOUDFLARE_API_TOKEN` on `apps/tenant-worker`
- `CLOUDFLARE_ACCOUNT_ID` on `apps/tenant-worker`
- `AUTH_WORKER_URL` on each Next.js frontend worker runtime
- `AUTH_WORKER_INTERNAL_URL` on `apps/admin-dashboard`
- `TENANT_WORKER_INTERNAL_URL` on `apps/admin-dashboard`

Recommended additional secrets:

- Better Auth social provider credentials
- Sentry DSNs
- OTLP exporter credentials if observability is enabled

Example:

```bash
pnpm dlx wrangler secret put BETTER_AUTH_SECRET --config apps/auth-worker/wrangler.jsonc
pnpm dlx wrangler secret put INTERNAL_BOOTSTRAP_SECRET --config apps/auth-worker/wrangler.jsonc
pnpm dlx wrangler secret put INTERNAL_BOOTSTRAP_SECRET --config apps/tenant-worker/wrangler.jsonc
pnpm dlx wrangler secret put CLOUDFLARE_API_TOKEN --config apps/tenant-worker/wrangler.jsonc
pnpm dlx wrangler secret put CLOUDFLARE_ACCOUNT_ID --config apps/tenant-worker/wrangler.jsonc
```

## 5a) CI/CD Environment Configuration

The GitHub Actions deploy workflows use GitHub Environments named `staging` and `production`.

Configure these environment secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `BETTER_AUTH_SECRET`
- `INTERNAL_BOOTSTRAP_SECRET`
- optional Better Auth social provider secrets
- optional `PHONE_OTP_WEBHOOK_URL`

Configure these environment variables:

- `AUTH_WORKER_URL`
- `AUTH_WORKER_INTERNAL_URL`
- `TENANT_WORKER_INTERNAL_URL`
- optional `BETTER_AUTH_TRUSTED_ORIGINS`
- optional `BETTER_AUTH_COOKIE_DOMAIN`

The deploy workflows will sync these values into the relevant Worker and Next.js runtimes before deployment.

## 6) Verify Before Deploy

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Focus checks:

- gateway tenant resolution for `*.africasokoni.co.ke`
- Better Auth bearer token verification through the gateway
- tenant onboarding creating D1, KV, R2, Queue, and worker-domain mappings
- KES defaults in gateway examples, storefront defaults, and ledger writes

## 7) Deploy Workers

Deploy in this order so auth and tenancy dependencies come up first:

```bash
pnpm dlx wrangler deploy --config apps/auth-worker/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/tenant-worker/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/gateway/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/catalog-worker/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/order-worker/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/vendor-worker/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/ledger-worker/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/cart-durable-object/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/inventory-durable-object/wrangler.jsonc
pnpm dlx wrangler deploy --config apps/rate-limiter-durable-object/wrangler.jsonc
```

Deploy the Next.js applications after the workers are healthy.

## 8) Post-Deploy Validation

- Open the gateway Swagger UI and confirm production servers show `https://{tenant}.africasokoni.co.ke`
- Create a tenant and verify onboarding returns real Cloudflare resource IDs
- Confirm the created tenant host resolves through the gateway
- Confirm seeded storefront domains are under `africasokoni.co.ke`
- Confirm order and ledger flows use `KES` in seeded and example paths

## 9) Operational Hardening

- Rotate bootstrap passwords after first sign-in
- Enable Sentry and OTLP exports for workers and Next.js apps
- Add CI enforcement for `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`
- Back up D1 migration history and verify queue retry policies before launch
