# Hướng dẫn chuẩn implement 1 feature (ví dụ: CRUD bất động sản)

## Quy trình triển khai (logic tổng quát)

1. **Định nghĩa type/interface**
   - Tạo file trong `src/types/` để định nghĩa type/interface cho thực thể (entity) cần CRUD.
   - Ví dụ: `src/types/property.ts`.
   - Lý do: Thống nhất dữ liệu, type-safe xuyên suốt backend/frontend, dễ trao đổi trong team.

2. **Business logic layer (server)**
   - Tạo file trong `src/server/` để chứa các hàm xử lý nghiệp vụ, thao tác database (Firestore) cho entity.
   - Ví dụ: `src/server/propertyS.server.ts`.
   - Lý do: Tách biệt logic nghiệp vụ khỏi API, dễ test, dễ tái sử dụng, không phụ thuộc framework.

3. **Định nghĩa router tRPC (api)**
   - Tạo router mới trong `src/api/trpc/routers/` cho entity.
   - Định nghĩa các endpoint CRUD, validate input với Zod.
   - Nếu feature cần xác thực, sử dụng `protectedProcedure` thay vì `publicProcedure` để bảo vệ endpoint (chỉ cho user đã đăng nhập hoặc có quyền truy cập).
     - Ví dụ: `create: protectedProcedure.input(...).mutation(...)`
     - `protectedProcedure` thường được định nghĩa ở `src/api/trpc/trpc.ts` hoặc tương tự, dùng để kiểm tra context (ctx.user) và throw error nếu chưa đăng nhập.
   - Khi cần lấy thông tin user (ví dụ userId) trong logic, lấy từ `ctx.user` trong procedure và truyền vào các hàm service ở tầng server.
     - Ví dụ:
       ```ts
       create: protectedProcedure.input(...).mutation(async ({ input, ctx }) => {
         return propertyService.createProperty(input, ctx.user.id);
       })
       ```
   - Lý do: tRPC giúp API typesafe, Zod đảm bảo dữ liệu vào hợp lệ, router chỉ gọi business logic, bảo vệ endpoint rõ ràng, truyền user qua context an toàn.

4. **Gọi API từ client (services)**
   - Tạo file trong `src/services/` để wrap các hàm gọi tRPC client tương ứng endpoint vừa tạo.
   - Ví dụ: `src/services/property.ts`.
   - Lý do: Tách biệt logic gọi API khỏi UI, dễ test, dễ thay đổi backend mà không ảnh hưởng UI.

5. **Custom hooks & queries**
   - Nếu là custom hook liên quan đến data fetching/mutation (TanStack Query), đặt trong `src/queries/`.
     - Ví dụ: `src/queries/usePropertyQuery.ts` (chứa usePropertyQuery, useCreatePropertyMutation, ...).
   - Nếu là custom hook cho logic UI, event, responsive, hoặc không liên quan đến data, đặt trong `src/hooks/`.
     - Ví dụ: `src/hooks/useMobile.ts`, `src/hooks/useDebounce.ts`, `src/hooks/useAuth.ts`.
   - Lý do: Tách biệt giúp team dễ tìm kiếm, bảo trì, phân biệt rõ các hook thao tác dữ liệu và các hook logic UI. Đặt tên hook rõ ràng (vd: usePropertyQuery, useAuth, useMobile...).
   - Các hook query sẽ sử dụng các hàm trong services để lấy/gửi dữ liệu.

6. **UI components**
   - Tạo các component UI trong `src/components/[entity]/` (ví dụ: form, list, item...).
   - Ví dụ: `src/components/property/PropertyForm.tsx`, `PropertyList.tsx`.
   - Lý do: Tách biệt UI thành các component nhỏ, dễ tái sử dụng, kiểm thử, bảo trì.
   - Sử dụng các custom hook ở trên để thao tác dữ liệu.

7. **Page/route**
   - Tạo page mới trong `src/app/` cho entity (ví dụ: danh sách, chi tiết, tạo mới, chỉnh sửa...).
   - Ví dụ: `src/app/properties/page.tsx`, `src/app/properties/[id]/page.tsx`.
   - Lý do: Next.js app directory giúp định nghĩa route rõ ràng, dễ mở rộng, tổ chức code tốt.
   - Sử dụng các component và hook đã tạo để xây dựng UI/UX.

---

> **Tóm tắt:**
> - Data fetching/mutation: queries/
> - UI logic, event, responsive: hooks/
> - Service gọi API: services/
> - Business logic thao tác DB: server/
> - Định nghĩa type: types/
> - UI component: components/[entity]/
> - Page: app/

> **Ví dụ đặt tên hook:**
> - usePropertyQuery, useCreatePropertyMutation (queries/)
> - useAuth, useMobile, useDebounce (hooks/)

---

## Chú ý về xử lý lỗi (error handling)

- **Tầng service (server/):**
  - Chỉ throw Error hoặc custom Error (ví dụ: throw new Error('Not found')).
  - Không import hay throw TRPCError ở tầng này để giữ cho service thuần logic, dễ test, dễ tái sử dụng ở các môi trường khác (background job, script...).

- **Tầng router tRPC:**
  - Bắt lỗi từ service, chuyển thành TRPCError phù hợp để trả về cho client.
  - Ví dụ:
    ```ts
    import { TRPCError } from '@trpc/server';
    ...
    get: protectedProcedure.input(...).query(async ({ input, ctx }) => {
      try {
        return await propertyService.getProperty(input, ctx.user.id);
      } catch (err) {
        if (err.message === 'Not found') throw new TRPCError({ code: 'NOT_FOUND' });
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message });
      }
    })
    ```

- **Lý do:**
  - Giữ cho service không phụ thuộc tRPC, dễ test/unit test, dễ dùng lại ở các môi trường khác.
  - Router kiểm soát toàn bộ error trả về cho client, đảm bảo đúng chuẩn tRPC và dễ log/debug.

- **Quy tắc:**
  - Không throw TRPCError ở tầng service.
  - Luôn catch và chuyển lỗi thành TRPCError ở router.
  - Đặt message lỗi rõ ràng, dễ debug, không lộ thông tin nhạy cảm ra ngoài client.

