const toBytes = (value: string): Uint8Array => {
  return new TextEncoder().encode(value);
};

const toBase64 = (bytes: Uint8Array): string => {
  return btoa(String.fromCharCode(...bytes));
};

const fromBase64 = (value: string): Uint8Array => {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
};

const deriveAesGcmKey = async (secret: string): Promise<CryptoKey> => {
  const digest: ArrayBuffer = await crypto.subtle.digest("SHA-256", toBytes(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
};

export const encryptClerkSecretKey = async (secretKey: string, encryptionSecret: string): Promise<string> => {
  const key: CryptoKey = await deriveAesGcmKey(encryptionSecret);
  const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(12));
  const encrypted: ArrayBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    toBytes(secretKey)
  );
  return `${toBase64(iv)}.${toBase64(new Uint8Array(encrypted))}`;
};

export const decryptClerkSecretKey = async (
  encryptedPayload: string,
  encryptionSecret: string
): Promise<string> => {
  const segments: string[] = encryptedPayload.split(".");
  if (segments.length !== 2 || segments[0] === undefined || segments[1] === undefined) {
    throw new Error("Invalid encrypted payload");
  }
  const key: CryptoKey = await deriveAesGcmKey(encryptionSecret);
  const iv: Uint8Array = fromBase64(segments[0]);
  const encrypted: Uint8Array = fromBase64(segments[1]);
  const decrypted: ArrayBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    encrypted
  );
  return new TextDecoder().decode(decrypted);
};
