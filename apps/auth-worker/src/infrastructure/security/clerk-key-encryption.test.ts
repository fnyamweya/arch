import { describe, expect, it } from "vitest";
import { decryptClerkSecretKey, encryptClerkSecretKey } from "./clerk-key-encryption";

describe("clerk key encryption", () => {
  it("encrypts and decrypts clerk secret key", async () => {
    const encryptionSecret = "encryption-secret";
    const secret = "sk_test_secret_key";
    const encrypted = await encryptClerkSecretKey(secret, encryptionSecret);
    const decrypted = await decryptClerkSecretKey(encrypted, encryptionSecret);
    expect(decrypted).toBe(secret);
  });
});
