# Tech Stack

- **Next.js 15** (React framework)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Radix UI** (Avatar, Collapsible, Dialog, Dropdown Menu, Label, Separator, Slot, Tooltip)
- **shadcn/ui**
- **lucide-react** (icon library)
- **Zod**
- **TanStack Query (React Query)**
- **tRPC**
- **Firebase** & **Firebase Admin**
- **Genkit** (AI/GoogleAI)
- **ESLint**

---

## Cấu trúc thư mục dự án

```
propmate/
├── public/                  # Ảnh, icon, file tĩnh
├── scripts/                 # Script tiện ích (reset Firestore, ...)
├── src/
│   ├── api/                 # Định nghĩa backend (tRPC routers, handler)
│   │   └── trpc/
│   ├── app/                 # Next.js app directory (routes, layout, page)
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/          # UI components (chia nhỏ theo domain hoặc loại)
│   │   ├── app-sidebar.tsx
│   │   ├── login-form.tsx
│   │   ├── nav-main.tsx
│   │   ├── nav-projects.tsx
│   │   ├── nav-user.tsx
│   │   ├── team-switcher.tsx
│   │   └── ui/              # Các UI component nhỏ (button, card, ...)
│   ├── constants/            # Định nghĩa các hằng số dùng chung toàn dự án
│   ├── queries/             # Custom hook data fetching/mutation (TanStack Query)
│   ├── hooks/               # Custom hook UI, event, responsive, logic không liên quan đến data
│   ├── lib/                 # Tiện ích, config, firebase, genkit, ...
│   │   ├── firebase/
│   │   ├── genkit/
│   │   └── utils.ts
│   ├── server/              # Business logic layer, service backend
│   ├── services/            # Hàm gọi API, thao tác dữ liệu phía client
│   └── types/               # Định nghĩa type/interface chung
├── docs/                    # Tài liệu dự án (nếu có)
├── package.json
├── README.md
└── ...
```

---

## Scripts

Các lệnh có thể chạy trong dự án:

- `pnpm dev`: Chạy server phát triển Next.js
- `pnpm build`: Build project Next.js
- `pnpm start`: Chạy project ở chế độ production
- `pnpm lint`: Kiểm tra code với ESLint
- `pnpm reset:db`: Xóa toàn bộ dữ liệu Firestore (chỉ dùng cho môi trường dev/test)

> Lưu ý: Dự án này sử dụng **pnpm** để quản lý package, không dùng npm.

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

### Ví dụ sử dụng TanStack Query & tRPC

#### Định nghĩa router tRPC (server-side)
```ts
// src/api/trpc/routers/user.ts
import { router, publicProcedure } from '../trpc'
export const userRouter = router({
  getMe: publicProcedure.query(async ({ ctx }) => {
    // Trả về thông tin user
  }),
})
```

#### Gọi tRPC từ client (services)
```ts
// src/services/user.ts
import { trpc } from '@/lib/trpc'
export const getMe = () => trpc.user.getMe.query()
```

#### Sử dụng trong custom hook với TanStack Query
```ts
// src/hooks/useUser.ts
import { useQuery } from '@tanstack/react-query'
import { getMe } from '@/services/user'
export const useMe = () => useQuery({ queryKey: ['me'], queryFn: getMe })
```

#### Sử dụng trong component
```tsx
import { useMe } from '@/hooks/useUser'
export default function Profile() {
  const { data: user, isLoading } = useMe()
  if (isLoading) return <div>Loading...</div>
  return <div>Hello, {user?.name}</div>
}
```
