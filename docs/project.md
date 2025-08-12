
# Project tech stack

## Core
- **Next.js 15** (React framework, SSR/SSG)
- **React 19**
- **TypeScript 5**

## Styling/UI
- **Tailwind CSS 4** (utility-first CSS)
- **Radix UI** (UI primitives: Avatar, Dialog, Dropdown, Tooltip...)
- **shadcn/ui** (UI kit)
- **lucide-react**, **@tabler/icons-react** (icon sets)
- **Swiper** (carousel/slider)
- **Recharts** (charts)
- **Leaflet**, **react-leaflet** (interactive maps)
- **@dnd-kit** (drag & drop)
- **vaul** (UI components)

## State & Data
- **TanStack Query (React Query)** (server state)
- **tRPC** (type-safe API communication)
- **Zod** (schema validation)

## Backend/Cloud
- **Firebase** & **Firebase Admin SDK** (database, auth, storage)
- **Google AI API** (gọi trực tiếp, không dùng Genkit)

## Dev Tools
- **ESLint**, **eslint-config-next**, **@biomejs/biome** (lint/format)
- **tsx** (TS runtime)
- **dotenv** (env config)
- **PostCSS**
- **pnpm** (package manager)

## Utilities
- **class-variance-authority**, **clsx**, **tailwind-merge** (class helpers)

> Ngoài ra còn nhiều package hỗ trợ phát triển, type definitions, scripts tiện ích... (xem chi tiết trong package.json)



# Cấu trúc thư mục dự án

```
propmate/
├── public/                  # Ảnh, icon, file tĩnh, assets
│   └── page-home/           # Ảnh minh họa cho trang chủ
├── scripts/                 # Script tiện ích (reset Firestore, test firebase, ...)
├── src/
│   ├── app/                 # Next.js app directory (routing, layout, pages)
│   │   ├── (prop-mate-app)/ # App chính: layout, account, dashboard, properties
│   │   ├── (public-pages)/  # Các trang public: about, contact, login, ...
│   │   ├── _trpc/           # tRPC client/provider cho app
│   │   ├── api/             # API routes (login, logout, trpc)
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components/          # UI components chia theo domain
│   │   ├── page-account/
│   │   ├── page-home/
│   │   ├── page-map/
│   │   ├── page-properties/
│   │   ├── page-story/
│   │   ├── ui/              # UI nhỏ: button, card, input, ...
│   │   └── ...              # Các component dùng chung
│   ├── constants/           # Hằng số toàn dự án
│   ├── hooks/               # Custom hook UI, logic
│   ├── lib/                 # Tiện ích, config, firebase, genkit
│   │   ├── firebase/        # Firebase client & admin
│   │   └── utils.ts
│   ├── server/              # Business logic layer, backend service
│   │   ├── api/             # tRPC root, routers, ...
│   │   └── auth/            # Xác thực phía server
│   ├── types/               # Định nghĩa type/schema chung
├── docs/                    # Tài liệu dự án, hướng dẫn, notes
│   └── old-docs/            # Tài liệu cũ, lưu trữ
├── package.json
├── README.md
├── biome.json, eslint.config.mjs, ... # Config lint/format
├── next.config.ts, tsconfig.json, ... # Config Next.js, TypeScript
├── pnpm-lock.yaml, pnpm-workspace.yaml # Quản lý package
└── ...
```

---

## Scripts

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

## Hướng dẫn sử dụng & ví dụ

### 1. Cài đặt dependencies
```bash
pnpm install
```

### 2. Chạy server phát triển
```bash
pnpm dev
```
Truy cập [http://localhost:3000](http://localhost:3000)

### 3. Build project
```bash
pnpm build
```

### 4. Chạy production
```bash
pnpm start
```

### 5. Kiểm tra code với ESLint
```bash
pnpm lint
```

### 6. Reset toàn bộ dữ liệu Firestore (chỉ dùng cho dev/test)
```bash
pnpm reset:db
```
> Lưu ý: Cần cấu hình biến môi trường và service account cho Firebase Admin SDK.

---




### Lấy và quản lý dữ liệu user (và các data khác) đúng cấu trúc dự án

#### 1. Lấy dữ liệu user ở Client Component

- Tạo custom hook tại: `src/hooks/useMe.ts`

```ts
// src/hooks/useMe.ts
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@/app/_trpc/client'

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => trpc.user.getMe.query(),
  })
}
```

- Sử dụng trong component, ví dụ: `src/app/(prop-mate-app)/account/page.tsx`

```tsx
import { useMe } from '@/hooks/useMe'

export default function AccountPage() {
  const { data: user, isLoading } = useMe()
  if (isLoading) return <div>Loading...</div>
  if (!user) return <div>Chưa đăng nhập</div>
  return <div>Xin chào, {user.name}</div>
}
```

#### 2. Lấy dữ liệu user ở Server Component

- Gọi router tRPC trực tiếp trong server component, ví dụ: `src/app/(prop-mate-app)/account/page.tsx`

```ts
// src/app/(prop-mate-app)/account/page.tsx
import { appRouter } from '@/server/api/root'
import { getServerUser } from '@/server/auth/getServerUser'

export default async function AccountPage() {
  const user = await appRouter.user.getMe({ ctx: { user: await getServerUser() } })
  return <div>Xin chào, {user?.name ?? 'Khách'}</div>
}
```

#### 3. Định nghĩa router tRPC cho user

- Đặt tại: `src/server/api/routers/user.ts`

```ts
// src/server/api/routers/user.ts
import { publicProcedure, router } from '../trpc'
export const userRouter = router({
  getMe: publicProcedure.query(async ({ ctx }) => {
    // ctx.user đã được inject từ getServerUser()
    return ctx.user
  }),
})
```

#### 4. Đăng ký router vào appRouter

- Đặt tại: `src/server/api/root.ts`

```ts
// src/server/api/root.ts
import { router } from './trpc'
import { userRouter } from './routers/user'
export const appRouter = router({
  user: userRouter,
  // ...other routers
})
```

#### 5. Tạo handler cho tRPC API route

- Đặt tại: `src/app/api/trpc/route.ts`

```ts
// src/app/api/trpc/route.ts
import { appRouter } from '@/server/api/root'
import { createNextRouteHandler } from 'trpc-next/route-handler'
import { getServerUser } from '@/server/auth/getServerUser'

export const { GET, POST } = createNextRouteHandler({
  router: appRouter,
  createContext: async () => ({ user: await getServerUser() }),
})
```

---

- Không dùng React Context cho user/global state.
- Tất cả state/data đều quản lý qua TanStack Query (client) hoặc fetch trực tiếp (server component).
- Đường dẫn, tên file, cấu trúc rõ ràng, dễ tìm, dễ mở rộng.
