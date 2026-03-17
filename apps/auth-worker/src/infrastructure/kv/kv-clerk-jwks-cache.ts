export const getCachedJwks = async (
  namespace: KVNamespace,
  jwksUrl: string
): Promise<string | null> => {
  return namespace.get(`jwks:${jwksUrl}`);
};

export const setCachedJwks = async (
  namespace: KVNamespace,
  jwksUrl: string,
  payload: string
): Promise<void> => {
  await namespace.put(`jwks:${jwksUrl}`, payload, { expirationTtl: 3600 });
};
