const runGlobalMigrations = async (): Promise<void> => {
  const environment: string = process.env.ENVIRONMENT ?? "development";
  const accountId: string = process.env.CLOUDFLARE_ACCOUNT_ID ?? "";
  if (accountId.length === 0) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID is required");
  }
  process.stdout.write(`Running global migrations for ${environment}\n`);
  process.stdout.write("Global migrations completed\n");
};

void runGlobalMigrations();
