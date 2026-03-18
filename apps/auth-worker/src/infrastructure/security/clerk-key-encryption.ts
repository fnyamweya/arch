const toBytes = (value: string): Uint8Array<ArrayBuffer> => {
  return Uint8Array.from(new TextEncoder().encode(value)) as Uint8Array<ArrayBuffer>;
};

const toBase64 = (bytes: Uint8Array): string => {
  return btoa(String.fromCharCode(...bytes));
};

const fromBase64 = (value: string): Uint8Array<ArrayBuffer> => {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0)) as Uint8Array<ArrayBuffer>;
};

const deriveAesGcmKey = async (secret: string): Promise<CryptoKey> => {
  const digest: ArrayBuffer = await crypto.subtle.digest("SHA-256", toBytes(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
};

export const encryptClerkSecretKey = async (secretKey: string, encryptionSecret: string): Promise<string> => {
  const key: CryptoKey = await deriveAesGcmKey(encryptionSecret);
  const iv: Uint8Array<ArrayBuffer> = Uint8Array.from(crypto.getRandomValues(new Uint8Array(12))) as Uint8Array<ArrayBuffer>;
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
  const iv: Uint8Array<ArrayBuffer> = Uint8Array.from(fromBase64(segments[0])) as Uint8Array<ArrayBuffer>;
  const encrypted: Uint8Array<ArrayBuffer> = fromBase64(segments[1]);
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
