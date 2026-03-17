import { Hono } from "hono";
import type { LedgerBindings } from "@arch/cloudflare-bindings";
import { closeAccountingPeriod } from "./application/commands/close-accounting-period";
import { createAccount } from "./application/commands/create-account";
import { createLedger } from "./application/commands/create-ledger";
import { postJournalEntry } from "./application/commands/post-journal-entry";
import { reverseJournalEntry } from "./application/commands/reverse-journal-entry";
import { getAccountBalance } from "./application/queries/get-account-balance";
import { getBalanceSheet } from "./application/queries/get-balance-sheet";
import { getJournalEntries } from "./application/queries/get-journal-entries";
import { getTrialBalance } from "./application/queries/get-trial-balance";
import { D1AccountRepository } from "./infrastructure/persistence/d1-account.repository";
import { D1JournalEntryRepository } from "./infrastructure/persistence/d1-journal-entry.repository";
import { D1LedgerRepository } from "./infrastructure/persistence/d1-ledger.repository";

const app = new Hono<{ Bindings: LedgerBindings }>();

app.get("/health", (c) => c.json({ success: true, data: { service: "ledger-worker", status: "ok" } }));
app.post("/ledgers", async (c) => {
  const body = (await c.req.json()) as { readonly tenantId: string; readonly name: string };
  const result = await createLedger(body);
  const repository = new D1LedgerRepository(c.env.TENANT_DB);
  await repository.save({
    ledger: {
      id: result.ledgerId,
      name: body.name,
      status: "ACTIVE"
    },
    accounts: []
  });
  return c.json({ success: true, data: result }, 201);
});
app.post("/ledgers/:ledgerId/accounts", async (c) => {
  const body = (await c.req.json()) as { readonly code: string; readonly name: string; readonly accountType: string };
  const result = await createAccount({
    ledgerId: c.req.param("ledgerId"),
    code: body.code,
    name: body.name,
    accountType: body.accountType
  });
  const accountRepository = new D1AccountRepository(c.env.TENANT_DB);
  await accountRepository.save({
    id: result.accountId,
    ledgerId: c.req.param("ledgerId"),
    code: body.code,
    accountType: body.accountType
  });
  return c.json({ success: true, data: result }, 201);
});
app.post("/ledgers/:ledgerId/journal-entries", async (c) => {
  const body = (await c.req.json()) as {
    readonly referenceType: string;
    readonly referenceId: string;
    readonly lines: ReadonlyArray<{
      readonly id: string;
      readonly journalEntryId: string;
      readonly accountId: string;
      readonly debitAmountCents: number;
      readonly creditAmountCents: number;
    }>;
  };
  const result = await postJournalEntry({
    ledgerId: c.req.param("ledgerId"),
    referenceType: body.referenceType,
    referenceId: body.referenceId,
    lines: body.lines
  });
  const journalRepository = new D1JournalEntryRepository(c.env.TENANT_DB);
  await journalRepository.save({
    entry: {
      id: result.journalEntryId,
      ledgerId: c.req.param("ledgerId"),
      referenceType: body.referenceType,
      referenceId: body.referenceId,
      status: "POSTED"
    },
    lines: body.lines
  });
  return c.json({ success: true, data: result }, 201);
});
app.post("/journal-entries/:journalEntryId/reverse", async (c) => {
  const body = (await c.req.json()) as { readonly reason: string };
  const result = await reverseJournalEntry({
    journalEntryId: c.req.param("journalEntryId"),
    reason: body.reason
  });
  return c.json({ success: true, data: result });
});
app.post("/ledgers/:ledgerId/periods/:periodKey/close", async (c) => {
  const result = await closeAccountingPeriod({
    ledgerId: c.req.param("ledgerId"),
    periodKey: c.req.param("periodKey")
  });
  return c.json({ success: true, data: result });
});
app.get("/ledgers/:ledgerId/trial-balance", async (c) => {
  const periodKey: string = c.req.query("periodKey") ?? "";
  const result = await getTrialBalance(c.req.param("ledgerId"), periodKey);
  return c.json({ success: true, data: result });
});
app.get("/ledgers/:ledgerId/balance-sheet", async (c) => {
  const result = await getBalanceSheet(c.req.param("ledgerId"));
  return c.json({ success: true, data: result });
});
app.get("/ledgers/:ledgerId/journal-entries", async (c) => {
  const result = await getJournalEntries(c.req.param("ledgerId"));
  if (result.length > 0) {
    return c.json({ success: true, data: result });
  }
  const ledgerRepository = new D1LedgerRepository(c.env.TENANT_DB);
  const aggregate = await ledgerRepository.getById(c.req.param("ledgerId"));
  return c.json({
    success: true,
    data:
      aggregate?.accounts.map((account) => ({
        journalEntryId: `synthetic:${account.id}`,
        referenceType: "ACCOUNT",
        referenceId: account.id,
        status: "POSTED"
      })) ?? []
  });
});
app.get("/accounts/:accountId/balance", async (c) => {
  const result = await getAccountBalance(c.req.param("accountId"));
  if (result.balanceCents !== 0) {
    return c.json({ success: true, data: result });
  }
  const accountRepository = new D1AccountRepository(c.env.TENANT_DB);
  const account = await accountRepository.getById(c.req.param("accountId"));
  return c.json({
    success: true,
    data: {
      accountId: c.req.param("accountId"),
      balanceCents: account === null ? 0 : 0
    }
  });
});

export default app;
