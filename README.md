
# PropMate: Real Estate Management App

PropMate là ứng dụng hỗ trợ nhà môi giới bất động sản trong công tác tiếp thị bán hàng.

---

## 📚 Mục lục

- [Tính năng nổi bật](#tính-năng-nổi-bật)
- [Cài đặt nhanh](#cài-đặt-nhanh)
- [Cấu hình Firebase](#cấu-hình-firebase)
- [Chạy local](#chạy-local)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Scripts](#scripts)
- [Lưu ý về TailwindCSS](#lưu-ý-về-tailwindcss)
- [License](#license)

---

## 🚀 Tính năng nổi bật

- Quản lý tài sản, khách hàng, lịch hẹn trực quan
- Tìm kiếm, lọc, xem chi tiết và bản đồ vị trí bất động sản
- Đồng bộ dữ liệu real-time với Firebase
- Đăng nhập, phân quyền, bảo mật dữ liệu
- Hỗ trợ offline-first, tối ưu cho thiết bị di động
- Giao diện hiện đại, dễ sử dụng

---

## 🛠️ Cài đặt nhanh

```bash
git clone https://github.com/tant/prop-mate
cd prop-mate
pnpm install
cp .env.sample .env.local # Điền thông tin Firebase vào file này
```

---

## 🔑 Cấu hình Firebase

1. Làm theo hướng dẫn tại [`docs/make-firebase.md`](docs/make-firebase.md) để tạo project, lấy config, thiết lập rule bảo mật và Storage.
2. Lưu ý: Để sử dụng Storage, cần nâng cấp Firebase lên gói Blaze (Pay as you go).

---

## ▶️ Chạy local

```bash
pnpm dev
```
Truy cập: http://localhost:3000

---

## 🧩 Công nghệ sử dụng

### Core
- **Next.js 15** (React framework, SSR/SSG)
- **React 19**
- **TypeScript 5**

### Styling/UI
- **Tailwind CSS 4** (utility-first CSS)
- **Radix UI** (UI primitives: Avatar, Dialog, Dropdown, Tooltip...)
- **shadcn/ui** (UI kit)
- **lucide-react**, **@tabler/icons-react** (icon sets)
- **Swiper** (carousel/slider)
- **Recharts** (charts)
- **Leaflet**, **react-leaflet** (interactive maps)
- **@dnd-kit** (drag & drop)
- **vaul** (UI components)

### State & Data
- **TanStack Query (React Query)** (server state)
- **tRPC** (type-safe API communication)
- **Zod** (schema validation)

### Backend/Cloud
- **Firebase** & **Firebase Admin SDK** (database, auth, storage)
- **Genkit**, **@genkit-ai/googleai** (AI integration)

### Dev Tools
- **ESLint**, **eslint-config-next**, **@biomejs/biome** (lint/format)
- **tsx** (TS runtime)
- **dotenv** (env config)
- **PostCSS**
- **pnpm** (package manager)

### Utilities
- **class-variance-authority**, **clsx**, **tailwind-merge** (class helpers)

---

## 📦 Scripts

Các lệnh có thể chạy trong dự án (dùng với pnpm):

- `pnpm dev` — Chạy server phát triển Next.js (hot reload, port 3000)
- `pnpm build` — Build project Next.js ra .next/ (chuẩn bị cho production)
- `pnpm start` — Chạy project ở chế độ production (sau khi build)
- `pnpm lint` — Kiểm tra code với ESLint và Biome (tự động fix nếu có thể)
- `pnpm reset:db` — Xóa toàn bộ dữ liệu Firestore (chạy script `scripts/reset-firestore.ts`, chỉ dùng cho môi trường dev/test)
- `pnpm exec tsx scripts/test-firebase-admin-sdk.ts` — Test kết nối và quyền Firebase Admin SDK (xem file `scripts/test-firebase-admin-sdk.ts`)
- `pnpm exec tsx scripts/test-firebase-clien-sdk.ts` — Test kết nối Firebase Client SDK (xem file `scripts/test-firebase-clien-sdk.ts`)

> Lưu ý: Dự án này sử dụng **pnpm** để quản lý package, không dùng npm/yarn. Nếu chưa cài pnpm, hãy xem hướng dẫn tại https://pnpm.io/installation

---

## ⚠️ Lưu ý về TailwindCSS

- Dự án sử dụng **TailwindCSS 4** (không dùng cú pháp, cấu hình, plugin cũ của Tailwind 3)
- Tham khảo tài liệu chính thức TailwindCSS 4 để đảm bảo code luôn tương thích

---

## 📄 License

MIT © 2025 Tan