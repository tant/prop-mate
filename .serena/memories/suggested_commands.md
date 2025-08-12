# Suggested Commands
- pnpm dev — Chạy server phát triển Next.js (hot reload, port 3000)
- pnpm build — Build project Next.js ra .next/ (chuẩn bị cho production)
- pnpm start — Chạy project ở chế độ production (sau khi build)
- pnpm lint — Kiểm tra code với ESLint và Biome (tự động fix nếu có thể)
- pnpm reset:db — Xóa toàn bộ dữ liệu Firestore (chỉ dùng cho môi trường dev/test)
- pnpm exec tsx scripts/test-firebase-admin-sdk.ts — Test kết nối và quyền Firebase Admin SDK
- pnpm exec tsx scripts/test-firebase-clien-sdk.ts — Test kết nối Firebase Client SDK
- Lưu ý: Dự án này dùng pnpm, không dùng npm/yarn.