import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CloudflareClient, D1Manager, KvManager } from "@arch/infrastructure-sdk";

const workspaceRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));

const requiredEnv = (name: string): string => {
    const value = process.env[name]?.trim();
    if (value === undefined || value.length === 0) {
        throw new Error(`${name} is required`);
    }
    return value;
};

const provisionOrReuse = async <TProvisioned>(
    findExisting: () => Promise<TProvisioned | null>,
    create: () => Promise<TProvisioned>
): Promise<TProvisioned> => {
    const existing = await findExisting();
    if (existing !== null) {
        return existing;
    }

    try {
        return await create();
    } catch {
        const afterFailure = await findExisting();
        if (afterFailure !== null) {
            return afterFailure;
        }
        throw new Error("Cloudflare platform provisioning failed before resources could be reused.");
    }
};

const replaceBindingValue = (
    source: string,
    binding: string,
    field: "database_id" | "id",
    nextValue: string
): string => {
    const pattern = new RegExp(`("binding":\s*"${binding}"[\\s\\S]*?"${field}":\s*")([^"]+)(")`);
    if (!pattern.test(source)) {
        throw new Error(`Unable to locate ${field} for binding ${binding}`);
    }
    return source.replace(pattern, `$1${nextValue}$3`);
};

const syncWranglerConfig = async (
    relativePath: string,
    replacements: ReadonlyArray<{
        readonly binding: string;
        readonly field: "database_id" | "id";
        readonly value: string;
    }>
): Promise<void> => {
    const filePath = resolve(workspaceRoot, relativePath);
    let source = await readFile(filePath, "utf8");

    for (const replacement of replacements) {
        source = replaceBindingValue(source, replacement.binding, replacement.field, replacement.value);
    }

    await writeFile(filePath, source, "utf8");
    process.stdout.write(`Updated ${relativePath}\n`);
};

const provisionPlatformResources = async (): Promise<void> => {
    const accountId = requiredEnv("CLOUDFLARE_ACCOUNT_ID");
    const apiToken = requiredEnv("CLOUDFLARE_API_TOKEN");
    const platformDatabaseName = process.env.PLATFORM_DATABASE_NAME?.trim() || "arch-platform-global";
    const platformKvNamespace = process.env.PLATFORM_CONFIG_NAMESPACE?.trim() || "arch-platform-config";

    const client = new CloudflareClient({
        accountId,
        apiToken,
        apiBaseUrl: "https://api.cloudflare.com/client/v4"
    });
    const d1Manager = new D1Manager(client, accountId);
    const kvManager = new KvManager(client, accountId);

    const [database, namespace] = await Promise.all([
        provisionOrReuse(
            () => d1Manager.findDatabaseByName(platformDatabaseName),
            () => d1Manager.createDatabase(platformDatabaseName)
        ),
        provisionOrReuse(
            () => kvManager.findNamespaceByTitle(platformKvNamespace),
            () => kvManager.createNamespace(platformKvNamespace)
        )
    ]);

    await Promise.all([
        syncWranglerConfig("apps/auth-worker/wrangler.jsonc", [
            { binding: "PLATFORM_DB", field: "database_id", value: database.databaseId },
            { binding: "PLATFORM_CONFIG_KV", field: "id", value: namespace.namespaceId }
        ]),
        syncWranglerConfig("apps/gateway/wrangler.jsonc", [
            { binding: "PLATFORM_DB", field: "database_id", value: database.databaseId },
            { binding: "PLATFORM_CONFIG_KV", field: "id", value: namespace.namespaceId }
        ]),
        syncWranglerConfig("apps/tenant-worker/wrangler.jsonc", [
            { binding: "PLATFORM_DB", field: "database_id", value: database.databaseId },
            { binding: "PLATFORM_CONFIG_KV", field: "id", value: namespace.namespaceId }
        ]),
        syncWranglerConfig("apps/ledger-worker/wrangler.jsonc", [
            { binding: "PLATFORM_DB", field: "database_id", value: database.databaseId }
        ])
    ]);

    process.stdout.write(`Platform D1 database: ${database.databaseId}\n`);
    process.stdout.write(`Platform KV namespace: ${namespace.namespaceId}\n`);
};

void provisionPlatformResources();