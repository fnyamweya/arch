This addendum extends the Approval Workflow Engine with three critical capabilities:

1. **Platform-Level Maker-Checker** — approval flows that operate at the global platform scope, not scoped to any single tenant, for operations like tenant provisioning, global ledger adjustments, platform configuration changes, and cross-tenant actions.
2. **Step-Up Authentication** — approval steps that require cryptographic verification (OTP, TOTP, WebAuthn/passkey, SMS code, email magic link) rather than or in addition to human review, enabling transaction-signing-grade security for high-sensitivity operations.
3. **Policy Versioning** — immutable, versioned policy definitions so that in-flight approval flows are never broken by policy changes, with controlled migration, deprecation, and rollback.
4. **Policy Configuration UX** — a declarative policy DSL, pre-built templates, visual builder contracts, and validation engine that makes policy authoring safe and intuitive for non-technical administrators.

---

## 1. PLATFORM-LEVEL MAKER-CHECKER

### The Problem

The original engine scopes all policies and flows to a `tenantId`. But platform administrators perform operations that either span tenants or have no tenant context: provisioning a new tenant, modifying the global ledger, changing platform billing rates, rotating Cloudflare API credentials, elevating a user to `PLATFORM_ADMIN`, or executing a cross-tenant data migration.

These operations are the most sensitive in the entire system and must have their own approval chains with their own approver pools.

### Architecture: Dual-Scope Policy System

The approval engine operates in two scopes, determined at submission time:

```typescript
const POLICY_SCOPES = {
  PLATFORM: "PLATFORM",
  TENANT: "TENANT",
} as const;

type PolicyScope = typeof POLICY_SCOPES[keyof typeof POLICY_SCOPES];
```

**Platform-scope flows:**
- Stored in the **global D1 database** (not any tenant's D1).
- Policies defined by platform admins only.
- Approvers resolved from the platform admin user pool.
- Audit trails written to the global audit log.
- Use the platform Sentry DSN.

**Tenant-scope flows:**
- Stored in the **tenant's D1 database** (as in the original design).
- Policies defined by tenant admins.
- Approvers resolved from within the tenant's Clerk Organization.
- Audit trails written to the tenant's audit log.
- Use the tenant's Sentry DSN.

### Revised ApprovalRequest Contract

```typescript
interface ApprovalRequest {
  readonly requestId: string;
  readonly scope: PolicyScope;
  readonly tenantId: string | null;       // null for PLATFORM scope
  readonly actionType: string;
  readonly actionCategory: string;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly requestedBy: string;
  readonly requestedByRole: string;
  readonly payload: Record<string, unknown>;
  readonly metadata: ApprovalMetadata;
}
```

### Platform Action Types

```typescript
const PLATFORM_ACTION_TYPES = {
  TENANT_PROVISION: "platform.tenant.provision",
  TENANT_SUSPEND: "platform.tenant.suspend",
  TENANT_TERMINATE: "platform.tenant.terminate",
  TENANT_PLAN_OVERRIDE: "platform.tenant.plan_override",
  TENANT_LIMIT_OVERRIDE: "platform.tenant.limit_override",

  GLOBAL_LEDGER_MANUAL_ENTRY: "platform.ledger.manual_entry",
  GLOBAL_LEDGER_PERIOD_CLOSE: "platform.ledger.period_close",
  INTER_TENANT_SETTLEMENT: "platform.ledger.inter_tenant_settlement",
  PLATFORM_REVENUE_ADJUSTMENT: "platform.ledger.revenue_adjustment",

  PLATFORM_CONFIG_CHANGE: "platform.config.change",
  PLATFORM_SECRET_ROTATION: "platform.config.secret_rotation",
  CLOUDFLARE_API_KEY_ROTATION: "platform.config.cf_key_rotation",

  PLATFORM_ADMIN_ELEVATION: "platform.auth.admin_elevation",
  PLATFORM_ADMIN_REMOVAL: "platform.auth.admin_removal",

  BULK_TENANT_MIGRATION: "platform.ops.bulk_migration",
  INFRASTRUCTURE_SCALING: "platform.ops.infrastructure_scaling",
  GLOBAL_FEATURE_FLAG_CHANGE: "platform.ops.global_feature_flag",
} as const;
```

### D1 Schema Separation

```
Global D1 (arch-platform-global)
├── platform_approval_policies          # platform-scope policies
├── platform_approval_policy_versions   # versioned policy snapshots
├── platform_approval_flows             # platform-scope flows
├── platform_approval_steps             # steps within platform flows
├── platform_approval_actions           # approver actions
├── platform_approval_audit_log         # platform audit trail

Tenant D1 (arch-tenant-{slug})
├── tenant_approval_policies
├── tenant_approval_policy_versions
├── tenant_approval_flows
├── tenant_approval_steps
├── tenant_approval_actions
├── tenant_approval_audit_log
```

### Routing in the Approval Worker

The approval-worker resolves scope at the entry point and routes to the correct D1 binding:

```typescript
function resolveDatabase(
  scope: PolicyScope,
  tenantId: string | null,
  env: ApprovalWorkerBindings
): D1Database {
  if (scope === "PLATFORM") {
    return env.GLOBAL_DB;
  }
  return resolveTenantD1(tenantId!, env);
}
```

### Platform Approver Resolution

Platform-scope policies use a separate approver resolution hierarchy:

```typescript
type PlatformApproverResolution =
  | { readonly type: "SPECIFIC_PLATFORM_ADMINS"; readonly userIds: ReadonlyArray<string> }
  | { readonly type: "PLATFORM_ROLE"; readonly role: PlatformRole }
  | { readonly type: "PLATFORM_ADMIN_QUORUM"; readonly minimumApprovers: number }
  | { readonly type: "SUPER_ADMIN" };

const PLATFORM_ROLES = {
  PLATFORM_SUPER_ADMIN: "platform:super_admin",
  PLATFORM_ADMIN: "platform:admin",
  PLATFORM_FINANCE: "platform:finance",
  PLATFORM_OPERATIONS: "platform:operations",
  PLATFORM_SECURITY: "platform:security",
} as const;
```

---

## 2. STEP-UP AUTHENTICATION

### The Problem

Some operations are so sensitive that a human clicking "Approve" is insufficient. Financial regulations, internal compliance, and security best practices demand cryptographic proof that the approver is physically present and in control of a second factor at the exact moment of approval. Examples: vendor payouts over a threshold, manual ledger adjustments, platform secret rotations, admin role changes.

### Design: Step-Up as a Step Type

Step-up authentication is modeled as a **step type** within the approval chain, not a separate system. This means it composes naturally with human approval steps — you can require MFA *before* human review, *after* human review, or as a standalone verification gate.

### Revised Step Types

```typescript
const STEP_TYPES = {
  SEQUENTIAL: "SEQUENTIAL",
  PARALLEL: "PARALLEL",
  ANY_OF: "ANY_OF",
  STEP_UP_AUTH: "STEP_UP_AUTH",
} as const;

type StepType = typeof STEP_TYPES[keyof typeof STEP_TYPES];
```

### StepUpAuthConfig Value Object

```typescript
type StepUpMethod =
  | "TOTP"            // Time-based OTP (Google Authenticator, Authy)
  | "SMS_OTP"         // SMS-delivered one-time code
  | "EMAIL_OTP"       // Email-delivered one-time code
  | "WEBAUTHN"        // Hardware key / passkey / biometric
  | "CLERK_MFA";      // Delegate to Clerk's MFA verification flow

interface StepUpAuthConfig {
  readonly method: StepUpMethod;
  readonly targetActor: StepUpTarget;
  readonly codeLength: number;                 // 6 or 8 digits for OTP
  readonly codeExpirationSeconds: number;      // default 300 (5 min)
  readonly maxAttempts: number;                 // default 3
  readonly cooldownSeconds: number;            // between retries, default 60
  readonly messageTemplate: string | null;     // custom OTP message
  readonly requireFreshAuthentication: boolean; // force re-auth even if session is valid
}

type StepUpTarget =
  | { readonly type: "MAKER" }                  // the person who requested the action
  | { readonly type: "CURRENT_APPROVER" }       // the person approving the current step
  | { readonly type: "SPECIFIC_USER"; readonly userId: string }
  | { readonly type: "ROLE"; readonly role: string };
```

### How Step-Up Works in the Chain

A step-up step is positioned anywhere in the chain definition:

```json
{
  "chain": {
    "steps": [
      {
        "stepType": "SEQUENTIAL",
        "requiredApprovals": 1,
        "approverResolution": { "type": "ROLE", "role": "org:finance_manager" }
      },
      {
        "stepType": "STEP_UP_AUTH",
        "stepUpConfig": {
          "method": "TOTP",
          "targetActor": { "type": "CURRENT_APPROVER" },
          "codeLength": 6,
          "codeExpirationSeconds": 300,
          "maxAttempts": 3,
          "cooldownSeconds": 60,
          "requireFreshAuthentication": false
        }
      },
      {
        "stepType": "SEQUENTIAL",
        "requiredApprovals": 1,
        "approverResolution": { "type": "PLATFORM_ROLE", "role": "platform:super_admin" }
      }
    ]
  }
}
```

This chain means: finance manager approves → finance manager proves identity via TOTP → super admin gives final approval.

### Step-Up Flow (Within ApprovalFlowDO)

```
1. Chain advances to a STEP_UP_AUTH step.
2. DO sets step status to AWAITING_VERIFICATION.
3. DO resolves the target actor from StepUpTarget.
4. DO generates a challenge:
   - TOTP: no generation needed; user provides their authenticator code.
   - SMS_OTP / EMAIL_OTP: generate random code, store hash in DO SQLite,
     publish SendStepUpCode event to notification queue.
   - WEBAUTHN: generate challenge bytes, store in DO, return to client.
   - CLERK_MFA: return a Clerk step-up session token requirement.
5. Client submits verification response to:
   POST /approvals/requests/:requestId/steps/:stepId/verify
6. DO validates:
   - TOTP: verify code against user's TOTP secret (stored in Clerk or platform DB).
   - SMS_OTP / EMAIL_OTP: compare hash of submitted code with stored hash.
   - WEBAUTHN: verify assertion against stored public key.
   - CLERK_MFA: verify Clerk session has elevated assurance level.
7. On success: step status → VERIFIED, chain advances.
8. On failure: increment attempt counter.
   - If attempts exhausted: step status → FAILED, flow → REJECTED.
   - If attempts remain: return error with remaining attempts.
```

### StepUp Verification Endpoints

```
POST /approvals/requests/:requestId/steps/:stepId/verify
Body:
  | { method: "TOTP"; code: string }
  | { method: "SMS_OTP"; code: string }
  | { method: "EMAIL_OTP"; code: string }
  | { method: "WEBAUTHN"; assertion: WebAuthnAssertion }
  | { method: "CLERK_MFA"; sessionToken: string }

POST /approvals/requests/:requestId/steps/:stepId/resend
  (for SMS_OTP and EMAIL_OTP only — generates new code, resets expiry)
```

### OTP Generation & Storage (In Durable Object)

```typescript
interface StepUpChallenge {
  readonly stepId: string;
  readonly method: StepUpMethod;
  readonly targetUserId: string;
  readonly codeHash: string | null;       // bcrypt hash of OTP code (SMS/Email)
  readonly challengeBytes: string | null; // base64 (WebAuthn)
  readonly attemptsUsed: number;
  readonly maxAttempts: number;
  readonly expiresAt: number;             // unix timestamp
  readonly createdAt: number;
  readonly lastAttemptAt: number | null;
}
```

OTP codes are generated using Web Crypto API's `getRandomValues`, hashed before storage, and never logged or persisted in plaintext. The Durable Object is the only place that holds challenge state, ensuring single-threaded verification with no race conditions.

### Combining Step-Up with Human Approval (Composite Steps)

For the most sensitive operations, you may want the approver to both review AND prove identity in a single step. This is modeled as a composite:

```typescript
interface CompositeStepDefinition {
  readonly stepType: "COMPOSITE";
  readonly humanApproval: {
    readonly requiredApprovals: number;
    readonly approverResolution: ApproverResolution;
  };
  readonly stepUpAuth: StepUpAuthConfig;
  readonly order: "APPROVE_THEN_VERIFY" | "VERIFY_THEN_APPROVE";
}
```

With `APPROVE_THEN_VERIFY`, the approver clicks "Approve" and is immediately prompted for MFA before the approval is recorded. With `VERIFY_THEN_APPROVE`, the approver must pass MFA before the approval form is even presented (useful for viewing sensitive payload data).

### Revised Complete Step Type Union

```typescript
type ChainStepDefinition =
  | {
      readonly stepType: "SEQUENTIAL";
      readonly requiredApprovals: number;
      readonly timeoutHours: number | null;
      readonly approverResolution: ApproverResolution;
      readonly autoApproveConditions?: ReadonlyArray<ApprovalCondition>;
      readonly autoRejectConditions?: ReadonlyArray<ApprovalCondition>;
    }
  | {
      readonly stepType: "PARALLEL";
      readonly requiredApprovals: number;
      readonly timeoutHours: number | null;
      readonly approverResolution: ApproverResolution;
    }
  | {
      readonly stepType: "ANY_OF";
      readonly requiredApprovals: number;
      readonly timeoutHours: number | null;
      readonly approverResolution: ApproverResolution;
    }
  | {
      readonly stepType: "STEP_UP_AUTH";
      readonly stepUpConfig: StepUpAuthConfig;
      readonly timeoutHours: number | null;
    }
  | {
      readonly stepType: "COMPOSITE";
      readonly humanApproval: {
        readonly requiredApprovals: number;
        readonly approverResolution: ApproverResolution;
      };
      readonly stepUpAuth: StepUpAuthConfig;
      readonly order: "APPROVE_THEN_VERIFY" | "VERIFY_THEN_APPROVE";
      readonly timeoutHours: number | null;
    };
```

### Revised Step Statuses

```typescript
const STEP_STATUSES = {
  WAITING: "WAITING",
  ACTIVE: "ACTIVE",
  AWAITING_VERIFICATION: "AWAITING_VERIFICATION",
  VERIFIED: "VERIFIED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  FAILED: "FAILED",         // step-up auth failed (max attempts)
  SKIPPED: "SKIPPED",
  EXPIRED: "EXPIRED",
  DELEGATED: "DELEGATED",
  ESCALATED: "ESCALATED",
} as const;
```

---

## 3. POLICY VERSIONING

### The Problem

Policy changes must never break in-flight approval flows. If a tenant admin modifies a policy (adds a step, changes a threshold, removes an approver role) while there are active flows using the old policy definition, those flows must continue operating under the rules they were created with. Additionally, policies must be auditable — you must be able to answer "which exact policy version governed this approval that happened 6 months ago?"

### Design: Immutable Versioned Snapshots

**Principle:** Policies are never mutated. Every "update" creates a new version. In-flight flows pin to the version that was active when the flow was created.

### Policy Version Entity

```typescript
interface ApprovalPolicyVersion {
  readonly id: string;                // ULID — the version ID
  readonly policyId: string;          // stable policy ID across versions
  readonly version: number;           // monotonically incrementing: 1, 2, 3, ...
  readonly status: PolicyVersionStatus;
  readonly definition: PolicyDefinition;
  readonly changelog: string;         // human-readable description of what changed
  readonly createdBy: string;
  readonly createdAt: string;
  readonly activatedAt: string | null;
  readonly deprecatedAt: string | null;
  readonly archivedAt: string | null;
}

const POLICY_VERSION_STATUSES = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  DEPRECATED: "DEPRECATED",
  ARCHIVED: "ARCHIVED",
} as const;

type PolicyVersionStatus =
  typeof POLICY_VERSION_STATUSES[keyof typeof POLICY_VERSION_STATUSES];
```

### PolicyDefinition (Frozen Snapshot)

```typescript
interface PolicyDefinition {
  readonly name: string;
  readonly actionType: string;
  readonly actionCategory: string;
  readonly scope: PolicyScope;
  readonly priority: number;
  readonly conditions: ApprovalCondition;
  readonly chain: ApprovalChainDefinition;
  readonly escalation: EscalationConfig;
  readonly expirationHours: number;
  readonly stepUpRequirements: ReadonlyArray<StepUpRequirement> | null;
  readonly metadata: Record<string, unknown>;
  readonly schemaVersion: string;     // "2026-03-17" — the definition schema version
}
```

### Version Lifecycle State Machine

```
    ┌───────┐
    │ DRAFT │ ← new version created (editable)
    └───┬───┘
        │ activate()
        ▼
    ┌────────┐
    │ ACTIVE │ ← live, used for new flows
    └───┬────┘
        │ new version activated (auto-deprecates this one)
        ▼
  ┌────────────┐
  │ DEPRECATED │ ← no new flows, in-flight flows still use it
  └─────┬──────┘
        │ all in-flight flows using this version are resolved
        ▼
   ┌──────────┐
   │ ARCHIVED │ ← read-only, retained for audit
   └──────────┘
```

### Rules

1. **Only one ACTIVE version per policy at any time.** Activating a new version atomically deprecates the current active version.
2. **DRAFT versions are editable.** Once activated, the version is immutable.
3. **DEPRECATED versions cannot be re-activated.** To revert, create a new version that duplicates the deprecated definition.
4. **ARCHIVED versions are tombstones.** They exist only for audit trail. Archival happens automatically when the last in-flight flow using that version resolves.
5. **Flows pin to a version ID at creation time.** The `ApprovalFlow` entity stores `policyVersionId`, not `policyId`. This is the critical invariant.

### Revised ApprovalFlow Entity

```typescript
interface ApprovalFlow {
  readonly id: string;
  readonly tenantId: string | null;
  readonly scope: PolicyScope;
  readonly requestId: string;
  readonly policyId: string;
  readonly policyVersionId: string;    // pinned at flow creation
  readonly policyVersionNumber: number;
  // ... rest of flow fields
}
```

### Version-Aware Policy Evaluation

```typescript
async function evaluatePolicy(
  request: ApprovalRequest,
  policyRepository: ApprovalPolicyRepository
): Promise<ResolvedApprovalChain | null> {
  const activePolicies = await policyRepository
    .findActivePolicyVersionsByActionType(
      request.scope,
      request.tenantId,
      request.actionType
    );

  const sortedByPriority = activePolicies.sort(
    (a, b) => b.definition.priority - a.definition.priority
  );

  for (const policyVersion of sortedByPriority) {
    if (matchesCondition(policyVersion.definition.conditions, request)) {
      const chain = buildChain(policyVersion.definition.chain, request);
      return {
        policyId: policyVersion.policyId,
        policyVersionId: policyVersion.id,
        policyVersionNumber: policyVersion.version,
        chain,
      };
    }
  }

  return null;
}
```

### Migration Between Versions

When a policy is updated, the admin can choose how to handle in-flight flows on the old version:

```typescript
const VERSION_MIGRATION_STRATEGIES = {
  LET_COMPLETE: "LET_COMPLETE",     // in-flight flows continue under old version (default, safest)
  FORCE_REEVAL: "FORCE_REEVAL",     // cancel in-flight flows and re-submit under new version
  MIGRATE_STEPS: "MIGRATE_STEPS",   // attempt to map old steps to new steps (advanced)
} as const;
```

`LET_COMPLETE` is the default and only recommended strategy for production use. `FORCE_REEVAL` is available for emergency policy corrections. `MIGRATE_STEPS` is reserved for future implementation with a compatibility analyzer.

### Compatibility Validation on Activation

Before a new version can be activated, the engine runs a compatibility check:

```typescript
interface CompatibilityReport {
  readonly isCompatible: boolean;
  readonly breakingChanges: ReadonlyArray<BreakingChange>;
  readonly warnings: ReadonlyArray<string>;
  readonly inFlightFlowCount: number;
  readonly migrationStrategy: VersionMigrationStrategy;
}

type BreakingChange =
  | { readonly type: "STEP_COUNT_CHANGED"; readonly oldCount: number; readonly newCount: number }
  | { readonly type: "STEP_TYPE_CHANGED"; readonly stepIndex: number; readonly oldType: string; readonly newType: string }
  | { readonly type: "APPROVER_RESOLUTION_CHANGED"; readonly stepIndex: number }
  | { readonly type: "CONDITION_SCOPE_NARROWED" }
  | { readonly type: "CONDITION_SCOPE_WIDENED" }
  | { readonly type: "STEP_UP_ADDED"; readonly stepIndex: number }
  | { readonly type: "STEP_UP_REMOVED"; readonly stepIndex: number }
  | { readonly type: "EXPIRATION_SHORTENED" };
```

The admin dashboard displays this report before confirming activation. Breaking changes require explicit acknowledgment.

### Version History API

```
GET  /approvals/policies/:policyId/versions
GET  /approvals/policies/:policyId/versions/:versionId
POST /approvals/policies/:policyId/versions                 Create new DRAFT version
PUT  /approvals/policies/:policyId/versions/:versionId      Edit DRAFT version
POST /approvals/policies/:policyId/versions/:versionId/activate
POST /approvals/policies/:policyId/versions/:versionId/compatibility-check
GET  /approvals/policies/:policyId/versions/:versionId/in-flight-flows
POST /approvals/policies/:policyId/versions/rollback        Create new version from a previous version's definition
```

---

## 4. POLICY CONFIGURATION UX

### The Problem

Non-technical tenant admins and platform admins need to create and manage approval policies without writing JSON. The system must guide them through policy creation, validate configurations in real-time, and prevent invalid or dangerous policy definitions.

### Policy Templates (Pre-Built Starting Points)

The platform ships with pre-built policy templates that tenants can instantiate and customize:

```typescript
interface PolicyTemplate {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly applicableScopes: ReadonlyArray<PolicyScope>;
  readonly applicableActionTypes: ReadonlyArray<string>;
  readonly defaultDefinition: PolicyDefinition;
  readonly configurableFields: ReadonlyArray<ConfigurableField>;
  readonly complexity: "SIMPLE" | "STANDARD" | "ADVANCED";
}

interface ConfigurableField {
  readonly path: string;           // JSON path into the definition, e.g., "conditions.threshold"
  readonly label: string;
  readonly description: string;
  readonly fieldType: "NUMBER" | "STRING" | "BOOLEAN" | "SELECT" | "MULTI_SELECT" | "ROLE_PICKER" | "USER_PICKER" | "CURRENCY_AMOUNT" | "DURATION_HOURS";
  readonly defaultValue: unknown;
  readonly validation: ZodSchema;
  readonly required: boolean;
}
```

**Shipped Templates:**

| Template | Action Type | Complexity |
|---|---|---|
| High-Value Payout Gate | `vendor.payout` | SIMPLE |
| Refund Approval (Single) | `order.refund` | SIMPLE |
| Refund Approval (Multi-Level) | `order.refund` | STANDARD |
| Product Publish Quality Check | `catalog.product_publish` | SIMPLE |
| Vendor Onboarding Review | `vendor.approve` | STANDARD |
| Sensitive Config Change + MFA | `tenant.config_change` | ADVANCED |
| Financial Adjustment + Dual MFA | `ledger.manual_entry` | ADVANCED |
| Platform Tenant Provisioning | `platform.tenant.provision` | STANDARD |
| Platform Secret Rotation + Hardware Key | `platform.config.secret_rotation` | ADVANCED |
| Bulk Operation Gate | (multiple) | STANDARD |

### Policy Validation Engine

Every policy definition passes through a validation engine before it can be saved (even as DRAFT). Validation is implemented as a pure function in `packages/approval-contracts` so it runs on both server and client:

```typescript
interface PolicyValidationResult {
  readonly isValid: boolean;
  readonly errors: ReadonlyArray<PolicyValidationError>;
  readonly warnings: ReadonlyArray<PolicyValidationWarning>;
}

type PolicyValidationError =
  | { readonly code: "EMPTY_CHAIN"; readonly message: string }
  | { readonly code: "STEP_NO_APPROVERS"; readonly stepIndex: number; readonly message: string }
  | { readonly code: "PARALLEL_REQUIRES_GT_ONE"; readonly stepIndex: number; readonly message: string }
  | { readonly code: "ANY_OF_EXCEEDS_POOL"; readonly stepIndex: number; readonly required: number; readonly poolSize: number; readonly message: string }
  | { readonly code: "STEP_UP_INVALID_METHOD"; readonly stepIndex: number; readonly message: string }
  | { readonly code: "STEP_UP_NO_TARGET"; readonly stepIndex: number; readonly message: string }
  | { readonly code: "ESCALATION_CIRCULAR"; readonly message: string }
  | { readonly code: "ESCALATION_TO_SELF"; readonly message: string }
  | { readonly code: "CONDITION_INVALID_FIELD"; readonly field: string; readonly message: string }
  | { readonly code: "CONDITION_NEGATIVE_THRESHOLD"; readonly message: string }
  | { readonly code: "EXPIRATION_TOO_SHORT"; readonly hours: number; readonly minimumHours: number; readonly message: string }
  | { readonly code: "EXPIRATION_EXCEEDS_STEP_TIMEOUTS"; readonly message: string }
  | { readonly code: "DUPLICATE_APPROVER_ACROSS_STEPS"; readonly userId: string; readonly message: string }
  | { readonly code: "MAKER_AS_CHECKER"; readonly message: string }
  | { readonly code: "SCHEMA_VERSION_UNSUPPORTED"; readonly version: string; readonly message: string };

type PolicyValidationWarning =
  | { readonly code: "SINGLE_APPROVER_RISK"; readonly stepIndex: number; readonly message: string }
  | { readonly code: "NO_ESCALATION_CONFIGURED"; readonly message: string }
  | { readonly code: "LONG_EXPIRATION"; readonly hours: number; readonly message: string }
  | { readonly code: "STEP_UP_WITHOUT_FALLBACK"; readonly stepIndex: number; readonly message: string }
  | { readonly code: "CONDITION_ALWAYS_TRUE"; readonly message: string }
  | { readonly code: "HIGH_STEP_COUNT"; readonly count: number; readonly message: string };
```

### Anti-Patterns the Validator Catches

- **Maker as Checker**: policy where the maker (requestedBy) can also be an approver in any step.
- **Self-Escalation**: escalation target resolves to the same approver pool as the timed-out step.
- **Unreachable Steps**: a step whose approver resolution returns zero users for the current tenant.
- **Impossible Parallel**: `ANY_OF` step requiring 3 approvals but the role has only 2 members.
- **Expiration Shorter Than Sum of Step Timeouts**: the flow would always expire before steps complete.
- **Step-Up Without User MFA Configured**: the target user has no TOTP/WebAuthn registered.

### Policy Builder API Contracts (For Frontend)

The admin dashboard policy builder consumes these endpoints:

```
GET  /approvals/templates                                  List available templates
GET  /approvals/templates/:templateId                      Get template details
POST /approvals/templates/:templateId/instantiate          Create draft policy from template

POST /approvals/policies/validate                          Validate a policy definition (stateless)
POST /approvals/policies/simulate                          Simulate: given this policy and a mock request, show what would happen

GET  /approvals/metadata/action-types                      List all registered action types with descriptions
GET  /approvals/metadata/action-categories                 List all action categories
GET  /approvals/metadata/step-up-methods                   List available step-up methods
GET  /approvals/metadata/roles                             List available roles for the current scope
GET  /approvals/metadata/approver-candidates?role=X        List users matching a role (for previewing approver pools)
```

### Policy Simulation

Before activating a policy, admins can simulate it against hypothetical requests:

```typescript
interface PolicySimulationRequest {
  readonly policyVersionId: string;
  readonly mockRequest: Partial<ApprovalRequest>;
}

interface PolicySimulationResult {
  readonly wouldTrigger: boolean;
  readonly matchedConditions: ReadonlyArray<string>;
  readonly resolvedChain: {
    readonly steps: ReadonlyArray<{
      readonly stepIndex: number;
      readonly stepType: string;
      readonly resolvedApprovers: ReadonlyArray<{
        readonly userId: string;
        readonly displayName: string;
        readonly role: string;
      }>;
      readonly stepUpMethod: string | null;
      readonly estimatedTimeHours: number;
    }>;
    readonly totalEstimatedTimeHours: number;
  } | null;
  readonly validationResult: PolicyValidationResult;
}
```

---

## 5. REVISED COMPLETE SCHEMA (Migration Files)

### Global D1 Migrations

```
0030_platform_approval_create_policies.sql
0031_platform_approval_create_policy_versions.sql
0032_platform_approval_create_flows.sql
0033_platform_approval_create_steps.sql
0034_platform_approval_create_step_challenges.sql
0035_platform_approval_create_actions.sql
0036_platform_approval_create_audit_log.sql
0037_platform_approval_create_templates.sql
0038_platform_approval_add_indices.sql
```

### Tenant D1 Migrations

```
0020_approval_create_policies.sql
0021_approval_create_policy_versions.sql
0022_approval_create_flows.sql
0023_approval_create_steps.sql
0024_approval_create_step_challenges.sql
0025_approval_create_actions.sql
0026_approval_create_audit_log.sql
0027_approval_add_indices.sql
```

### Key Table: `approval_policy_versions`

```sql
CREATE TABLE approval_policy_versions (
  id TEXT PRIMARY KEY,
  policy_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  definition TEXT NOT NULL,                    -- JSON blob of PolicyDefinition
  schema_version TEXT NOT NULL,                -- e.g., "2026-03-17"
  changelog TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  activated_at TEXT,
  deprecated_at TEXT,
  archived_at TEXT,
  FOREIGN KEY (policy_id) REFERENCES approval_policies(id),
  UNIQUE(policy_id, version)
);

CREATE INDEX idx_apv_policy_status ON approval_policy_versions(policy_id, status);
CREATE INDEX idx_apv_active ON approval_policy_versions(status) WHERE status = 'ACTIVE';
```

### Key Table: `approval_step_challenges`

```sql
CREATE TABLE approval_step_challenges (
  id TEXT PRIMARY KEY,
  step_id TEXT NOT NULL,
  flow_id TEXT NOT NULL,
  method TEXT NOT NULL,
  target_user_id TEXT NOT NULL,
  code_hash TEXT,
  challenge_bytes TEXT,
  attempts_used INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  verified_at TEXT,
  FOREIGN KEY (step_id) REFERENCES approval_steps(id),
  FOREIGN KEY (flow_id) REFERENCES approval_flows(id)
);

CREATE INDEX idx_asc_step ON approval_step_challenges(step_id);
CREATE INDEX idx_asc_status ON approval_step_challenges(status) WHERE status = 'PENDING';
```

---

## 6. REVISED FLOW STATE MACHINE (Complete)

```
                       ┌──────────┐
                       │  PENDING │
                       └────┬─────┘
                            │ policy evaluated, chain built, version pinned
                            ▼
                     ┌──────────────┐
              ┌──────│ IN_PROGRESS  │◄──── step advanced ──────┐
              │      └──────┬───────┘                          │
              │        ┌────┼────┬────────┐                    │
              │        │    │    │        │                     │
              │        ▼    │    ▼        ▼                     │
              │   ┌────────┐│ ┌────────┐ ┌──────────────────┐  │
              │   │STEP    ││ │STEP    │ │STEP_UP           │  │
              │   │APPROVED││ │REJECTED│ │AWAITING_VERIFY   │  │
              │   └───┬────┘│ └───┬────┘ └───────┬──────────┘  │
              │       │     │     │              │              │
              │       │     │     │         ┌────┼────┐        │
              │       │     │     │         │         │        │
              │       │     │     │         ▼         ▼        │
              │       │     │     │   ┌──────────┐ ┌──────┐   │
              │       │     │     │   │ VERIFIED │ │FAILED│   │
              │       │     │     │   └────┬─────┘ └──┬───┘   │
              │       │     │     │        │          │        │
              │       └─────┼─────┼────────┘          │        │
              │     (more   │     │                    │        │
              │      steps?)│     │                    │        │
              │       YES───┘     │                    │        │
              │                   │                    │        │
              ▼                   ▼                    ▼        │
        ┌──────────┐      ┌──────────┐        ┌──────────┐    │
        │ APPROVED │      │ REJECTED │        │ REJECTED │    │
        └──────────┘      └──────────┘        └──────────┘    │
                                                               │
        ┌──────────┐      ┌───────────┐                       │
        │ EXPIRED  │      │ CANCELLED │                       │
        └──────────┘      └───────────┘                       │
```

---

## 7. EXAMPLE: FULL SOPHISTICATED POLICY

**Scenario:** Vendor payout in a financial services tenant. Amounts over $10,000 require vendor owner review → finance manager approval with TOTP → compliance officer approval with hardware key → platform finance team approval (for cross-cutting regulatory oversight).

```json
{
  "name": "High-Value Vendor Payout — Full Compliance Chain",
  "actionType": "vendor.payout",
  "actionCategory": "FINANCIAL",
  "scope": "TENANT",
  "priority": 200,
  "conditions": {
    "type": "AMOUNT_EXCEEDS",
    "threshold": 1000000,
    "currency": "USD"
  },
  "chain": {
    "steps": [
      {
        "stepType": "SEQUENTIAL",
        "requiredApprovals": 1,
        "timeoutHours": 8,
        "approverResolution": {
          "type": "ROLE_IN_VENDOR",
          "role": "org:vendor_owner",
          "vendorIdField": "payload.vendorId"
        }
      },
      {
        "stepType": "COMPOSITE",
        "humanApproval": {
          "requiredApprovals": 1,
          "approverResolution": { "type": "ROLE", "role": "org:finance_manager" }
        },
        "stepUpAuth": {
          "method": "TOTP",
          "targetActor": { "type": "CURRENT_APPROVER" },
          "codeLength": 6,
          "codeExpirationSeconds": 300,
          "maxAttempts": 3,
          "cooldownSeconds": 30,
          "requireFreshAuthentication": true
        },
        "order": "APPROVE_THEN_VERIFY",
        "timeoutHours": 24
      },
      {
        "stepType": "COMPOSITE",
        "humanApproval": {
          "requiredApprovals": 1,
          "approverResolution": { "type": "ROLE", "role": "org:compliance_officer" }
        },
        "stepUpAuth": {
          "method": "WEBAUTHN",
          "targetActor": { "type": "CURRENT_APPROVER" },
          "codeLength": 0,
          "codeExpirationSeconds": 120,
          "maxAttempts": 3,
          "cooldownSeconds": 10,
          "requireFreshAuthentication": true
        },
        "order": "VERIFY_THEN_APPROVE",
        "timeoutHours": 48
      },
      {
        "stepType": "STEP_UP_AUTH",
        "stepUpConfig": {
          "method": "TOTP",
          "targetActor": { "type": "MAKER" },
          "codeLength": 6,
          "codeExpirationSeconds": 300,
          "maxAttempts": 3,
          "cooldownSeconds": 60,
          "requireFreshAuthentication": false
        },
        "timeoutHours": 4
      }
    ]
  },
  "escalation": {
    "enabled": true,
    "escalateAfterHours": 24,
    "escalateTo": { "type": "TENANT_ADMIN" },
    "maxEscalations": 2,
    "notifyOnEscalation": true
  },
  "expirationHours": 120,
  "schemaVersion": "2026-03-17"
}
```

This chain means:
1. Vendor owner reviews the payout request (8h window).
2. Finance manager approves, then proves identity via TOTP authenticator app (24h window).
3. Compliance officer proves identity via hardware security key, then reviews and approves (48h window).
4. The original maker (who initiated the payout) confirms via their own TOTP — this is the "transaction signing" step that proves the maker still intends the action after the full review chain (4h window).

---

## 8. ADDITIONAL FILE STRUCTURE CHANGES

### New/Updated Packages

```
packages/
  approval-contracts/
    src/
      types.ts                    # updated with PolicyScope, StepUpAuthConfig, CompositeStep
      action-types.ts             # updated with PLATFORM_ACTION_TYPES
      events.ts                   # updated with step-up events
      policy-version.types.ts     # PolicyVersion lifecycle types
      policy-template.types.ts    # template definitions
      policy-validator.ts         # pure validation function (shared server+client)
      policy-simulator.ts         # simulation logic
      step-up.types.ts            # StepUpMethod, StepUpChallenge, verification types
      compatibility-checker.ts    # version compatibility analysis
      api-contracts/
        submit-request.contract.ts
        approval-decision.contract.ts
        step-up-verification.contract.ts
        policy-management.contract.ts
        policy-version.contract.ts
        policy-template.contract.ts
        policy-simulation.contract.ts
        query-contracts.ts
    package.json
```

### Updated approval-worker

```
apps/
  approval-worker/
    src/
      application/
        commands/
          # ... existing commands ...
          verify-step-up.ts
          resend-step-up-code.ts
          create-policy-version.ts
          update-policy-draft.ts
          activate-policy-version.ts
          deprecate-policy-version.ts
          instantiate-template.ts
          simulate-policy.ts
        queries/
          # ... existing queries ...
          list-policy-versions.ts
          get-compatibility-report.ts
          list-policy-templates.ts
          get-approver-candidates.ts
      domain/
        services/
          # ... existing services ...
          step-up-challenge.service.ts
          version-compatibility.service.ts
          policy-template.service.ts
      infrastructure/
        persistence/
          schema/
            # ... existing schemas ...
            policy-versions.schema.ts
            step-challenges.schema.ts
            policy-templates.schema.ts
        crypto/
          otp-generator.ts          # Web Crypto API random code generation
          otp-hasher.ts             # hash and verify OTP codes
          webauthn-verifier.ts      # WebAuthn assertion verification
```

---

## 9. VERIFICATION CHECKLIST ADDITIONS

- [ ] Platform-scope policies stored in global D1, tenant-scope in tenant D1.
- [ ] Platform-scope flows never reference a tenantId.
- [ ] In-flight flows pinned to policyVersionId, not policyId.
- [ ] Activating a new version atomically deprecates the current active version.
- [ ] DRAFT versions are editable; ACTIVE/DEPRECATED/ARCHIVED are immutable.
- [ ] Compatibility report generated and displayed before activation.
- [ ] OTP codes generated via Web Crypto `getRandomValues`, stored as hash only.
- [ ] OTP plaintext never logged, never persisted, never returned in API responses.
- [ ] Step-up challenge state lives exclusively in the Durable Object.
- [ ] WebAuthn challenge bytes are cryptographically random and single-use.
- [ ] `COMPOSITE` steps enforce ordering (APPROVE_THEN_VERIFY / VERIFY_THEN_APPROVE).
- [ ] Policy validation catches maker-as-checker, self-escalation, unreachable steps.
- [ ] Policy templates ship with the platform and are read-only for tenants.
- [ ] Simulation endpoint is stateless and creates no persistent data.
- [ ] All step-up verification endpoints are rate-limited per user per flow.