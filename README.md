
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
- **Google AI API** (gọi trực tiếp, không dùng Genkit)

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
- `pnpm test` — Chạy các test cases E2E với Playwright (trên Firefox)
- `pnpm test:ui` — Chạy các test cases E2E với Playwright và mở giao diện report
- `pnpm test:report` — Hiển thị báo cáo test gần nhất
- `pnpm reset:db` — Xóa toàn bộ dữ liệu Firestore (chạy script `scripts/reset-firestore.ts`, chỉ dùng cho môi trường dev/test)
- `pnpm exec tsx scripts/test-firebase-admin-sdk.ts` — Test kết nối và quyền Firebase Admin SDK (xem file `scripts/test-firebase-admin-sdk.ts`)
- `pnpm exec tsx scripts/test-firebase-clien-sdk.ts` — Test kết nối Firebase Client SDK (xem file `scripts/test-firebase-clien-sdk.ts`)

> Lưu ý: Dự án này sử dụng **pnpm** để quản lý package, không dùng npm/yarn. Nếu chưa cài pnpm, hãy xem hướng dẫn tại https://pnpm.io/installation

## 🧪 Testing

Dự án sử dụng Playwright để thực hiện các test cases E2E (End-to-End). Các test cases được viết trong thư mục `tests/` với các file:

- `homepage.spec.ts` - Test trang chủ
- `properties.spec.ts` - Test chức năng quản lý bất động sản
- `auth.spec.ts` - Test chức năng xác thực (đăng ký, đăng nhập, đăng xuất, quên mật khẩu)

Tổng cộng có 14 test cases với tỷ lệ thành công 79% (11/14 tests passed):

### ✅ Test Cases Passed (11/14 - 79%)
1. **Authentication (8/8 tests passed)**:
   - Đăng ký user hợp lệ
   - Hiển thị lỗi khi đăng ký với password không hợp lệ
   - Hiển thị lỗi khi password xác nhận không khớp
   - Đăng nhập với credentials hợp lệ
   - Hiển thị lỗi khi đăng nhập với credentials không hợp lệ
   - Đặt lại mật khẩu
   - Hiển thị lỗi khi đặt lại mật khẩu với email không tồn tại
   - Đăng xuất

2. **Homepage (2/2 tests passed)**:
   - Kiểm tra title của trang
   - Kiểm tra link "Vào app"

3. **Properties Page (1/4 tests passed)**:
   - Tìm kiếm bất động sản

### ⏭ Test Cases Skipped (1/14 - 7%)
- Cập nhật bất động sản (bị skip do không có dữ liệu mẫu)

### ❌ Test Cases Failed (2/14 - 14%)
- Hiển thị danh sách bất động sản
- Thêm bất động sản mới

Để chạy các test cases:

```bash
# Chạy tất cả các test cases
pnpm test

# Chạy test cases với giao diện
pnpm test:ui
```

### ⚙️ Cấu hình Playwright

Playwright được cấu hình để chạy test trên trình duyệt Firefox trong chế độ headless. Các cấu hình chính:

- **Trình duyệt**: Firefox (chỉ chạy trên 1 trình duyệt để tiết kiệm tài nguyên)
- **Chế độ**: Headless (không hiển thị giao diện trình duyệt)
- **Timeout**: 120 giây cho web server
- **Base URL**: http://localhost:3000
- **Report**: Hiển thị kết quả test dạng list trong console

Chi tiết cấu hình có thể xem trong file `playwright.config.ts`.

### 🛠 Hướng dẫn cải thiện các test cases bị fail

1. **"should display properties list"**:
   - Kiểm tra lại logic kiểm tra sự tồn tại của property cards hoặc thông báo "Bạn chưa có bất động sản nào"
   - Có thể cần tăng timeout cho việc load dữ liệu từ Firebase

2. **"should allow adding a new property"**:
   - Kiểm tra lại selector cho button "Thêm bất động sản" 
   - Có thể cần tối ưu hóa thời gian load trang `/properties/add`

Để debug các test cases bị fail, có thể chạy:
```bash
# Chạy test cụ thể với giao diện để xem trực quan
pnpm test:ui tests/properties.spec.ts:4

# Hoặc chạy với chế độ trace để xem chi tiết
pnpm test --trace on
```

---

## ⚠️ Lưu ý về TailwindCSS

- Dự án sử dụng **TailwindCSS 4** (không dùng cú pháp, cấu hình, plugin cũ của Tailwind 3)
- Tham khảo tài liệu chính thức TailwindCSS 4 để đảm bảo code luôn tương thích

---

## 📄 License

MIT © 2025 Tan