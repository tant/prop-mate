hãy review cấu trúc thư mục hiện tại và cho tôi danh sách các file cần phải thao tác

Dựa trên cấu trúc thư mục hiện tại của bạn, để triển khai đầy đủ nghiệp vụ Property với trpc, tanstack query và zod, bạn sẽ cần thao tác các file (hoặc tạo mới nếu chưa có) ở các vị trí sau:

Backend (API & Validation)

src/server/routers/property.ts
 → Tạo trpc router cho Property (CRUD, query, mutation).
property.ts
 → Đã có interface, cần tạo thêm zod schema (có thể đặt cùng file hoặc tách riêng, ví dụ: src/types/property.schema.ts).
root.ts hoặc trpc.ts
 → Import và gắn router property vào rootRouter nếu chưa có.
Frontend (Client, Query, UI) 4. client.ts
 → Đảm bảo đã export trpc client để dùng ở frontend. 5. src/app/(prop-mate-app)/property/
 → Tạo các file page, component cho Property:

list.tsx (hoặc page.tsx): Hiển thị danh sách Property.
detail.tsx: Hiển thị chi tiết Property.
form.tsx: Form tạo/sửa Property, dùng zod để validate.
components
 → Có thể tạo thêm các component tái sử dụng như PropertyTable.tsx, PropertyCard.tsx, v.v.
Optional 7. hooks
 → Tạo custom hook cho tanstack query, ví dụ: usePropertyQuery.ts, usePropertyMutation.ts. 8. constants
 → Nếu có các constant liên quan đến Property (loại, trạng thái, ...).

Tóm tắt các file cần thao tác hoặc tạo mới:

src/types/property.schema.ts (zod schema)
src/server/routers/property.ts (trpc router)
root.ts hoặc trpc.ts (gắn router)
client.ts (trpc client)
src/app/(prop-mate-app)/property/list.tsx (hoặc page.tsx)
src/app/(prop-mate-app)/property/detail.tsx
src/app/(prop-mate-app)/property/form.tsx
src/hooks/usePropertyQuery.ts, usePropertyMutation.ts (nếu muốn tách logic)
src/components/PropertyTable.tsx, PropertyCard.tsx (nếu cần)