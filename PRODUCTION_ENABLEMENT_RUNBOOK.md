# Production Enablement Runbook

## 1) Host Tooling Prerequisites

- Install Node.js 22 LTS.
- Enable Corepack.
- Enable pnpm.

PowerShell:

```powershell
winget install OpenJS.NodeJS.LTS
corepack enable
corepack prepare pnpm@9 --activate
```

## 2) Install Dependencies

```powershell
pnpm install
```

## 3) Required Verification Commands

```powershell
pnpm turbo lint
pnpm turbo typecheck
pnpm turbo test
pnpm turbo build
```

## 4) Cloudflare Runtime Configuration

Populate real values in each `apps/*/wrangler.jsonc`:

- D1 database ids
- KV namespace ids
- R2 bucket names
- Queue names
- service bindings
- durable object migrations

Do not keep placeholder ids in production.

## 5) Secret Management

Configure worker secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLERK_KEY_ENCRYPTION_SECRET`
- tenant Clerk webhook secrets
- tenant Clerk secret keys (encrypted at rest)
- Sentry DSNs (global + tenant)

## 6) Auth Hardening

- Ensure all tenant configs include valid `clerkJwksUrl`.
- Validate live Clerk JWT verification path in `auth-worker` with tenant-specific tokens.
- Validate webhook verification headers (`svix-id`, `svix-timestamp`, `svix-signature`) end-to-end.

## 7) Observability Hardening

- Wire `@sentry/cloudflare` and `@sentry/nextjs` in runtime entry points.
- Enable tenant tags (`tenant_id`, `tenant_slug`) consistently.
- Configure OTLP trace/log export endpoints in Wrangler environments.

## 8) Data & Ledger Safety Checks

- Validate journal entries reject unbalanced lines.
- Validate reversal and period-close constraints.
- Validate money fields remain integer cents in all write paths.

## 9) Integration Test Focus

- Gateway tenant resolution and auth guard behavior.
- Cross-tenant access denial tests.
- Durable object rate-limit behavior under concurrency.
- Worker proxy binding correctness for all service routes.
