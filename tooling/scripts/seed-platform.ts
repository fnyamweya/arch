import { ulid } from "ulid";

const seedPlatform = async (): Promise<void> => {
  const platformTenantId: string = ulid();
  process.stdout.write(`Seeding platform data with tenant ${platformTenantId}\n`);
  process.stdout.write("Platform seed completed\n");
};

void seedPlatform();
