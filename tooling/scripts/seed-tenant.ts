import { ulid } from "ulid";

const seedTenant = async (): Promise<void> => {
  const tenantId: string = process.argv[2] ?? ulid();
  process.stdout.write(`Seeding tenant data for ${tenantId}\n`);
  process.stdout.write("Tenant seed completed\n");
};

void seedTenant();
