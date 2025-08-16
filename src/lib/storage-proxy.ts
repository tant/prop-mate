// src/lib/storage-proxy.ts

/**
 * Tạo proxy URL cho file từ Firebase Storage
 * @param storagePath Đường dẫn của file trong Firebase Storage
 * @returns URL proxy để truy cập file
 */
export function getStorageProxyUrl(storagePath: string): string {
  // Encode path để đảm bảo an toàn trong URL
  const encodedPath = encodeURIComponent(storagePath);
  return `/api/storage-proxy?path=${encodedPath}`;
}