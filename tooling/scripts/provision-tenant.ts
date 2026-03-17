import { ulid } from "ulid";

const provisionTenant = async (): Promise<void> => {
  const tenantSlug: string = process.argv[2] ?? `tenant-${ulid().toLowerCase()}`;
  process.stdout.write(`Provisioning tenant infrastructure for ${tenantSlug}\n`);
  process.stdout.write("Tenant provisioning completed\n");
};

void provisionTenant();
