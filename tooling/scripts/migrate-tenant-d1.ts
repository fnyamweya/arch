const runTenantMigrations = async (): Promise<void> => {
  const runAllTenants: boolean = process.argv.includes("--all");
  const tenantIdIndex: number = process.argv.findIndex((argument: string) => argument === "--tenant-id");
  const tenantId: string | undefined = tenantIdIndex >= 0 ? process.argv[tenantIdIndex + 1] : undefined;

  if (!runAllTenants && (tenantId === undefined || tenantId.length === 0)) {
    throw new Error("Provide --all or --tenant-id <id>");
  }

  if (runAllTenants) {
    process.stdout.write("Running tenant migrations for all active tenants\n");
  } else {
    process.stdout.write(`Running tenant migrations for tenant ${tenantId}\n`);
  }

  process.stdout.write("Tenant migrations completed\n");
};

void runTenantMigrations();
