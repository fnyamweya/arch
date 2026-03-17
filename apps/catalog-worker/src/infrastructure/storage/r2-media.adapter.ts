export const putProductMedia = async (
  bucket: R2Bucket,
  key: string,
  value: ArrayBuffer
): Promise<void> => {
  await bucket.put(key, value);
};
