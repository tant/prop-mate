# Kế hoạch triển khai: Trang sản phẩm theo Template (MVP)

> Tài liệu này mô tả kế hoạch chi tiết để triển khai tính năng Trang sản phẩm theo Template, dựa trên các yêu cầu đã được định nghĩa trong PRD. **Trọng tâm của MVP là cung cấp một bộ template có sẵn (hardcoded) cho người dùng lựa chọn, không bao gồm chức năng quản trị template.**

---

## 1. Tổng quan & Mục tiêu

Mục tiêu chính là xây dựng một hệ thống cho phép người dùng **chọn từ các mẫu có sẵn** để tạo, quản lý và xuất bản các trang sản phẩm bất động sản một cách nhanh chóng. Các trang sản phẩm phải có thiết kế ấn tượng, thu hút, tối ưu cho SEO và responsive.

---

## 2. Lộ trình triển khai theo giai đoạn

### Giai đoạn 1: Nền tảng & Dữ liệu (Foundation & Data)
- **Mục tiêu:** Xây dựng lõi hệ thống, định nghĩa cấu trúc dữ liệu và API.
- **Công việc:**
  1.  **Định nghĩa Template Cố định:**
      -   Thiết kế và định nghĩa schema cho 2-3 template **hardcoded** trong code.
      -   Mỗi schema quy định rõ các section, slot, và các trường dữ liệu.
  2.  **Thiết kế Data Contract:**
      -   Tạo các interface/type trong TypeScript (sử dụng Zod để validation) cho `ProductPage`, `TemplateSchema`, `Section`.
      -   Chuẩn hóa cấu trúc lưu trữ trên Firestore.
  3.  **Xây dựng Backend API (tRPC):**
      -   API tạo trang sản phẩm (tự động gán `userId` của người dùng đang đăng nhập).
      -   APIs CRUD cho dữ liệu trang sản phẩm của người dùng (lấy danh sách, chi tiết, xóa, cập nhật). **Quan trọng: Mọi API truy xuất hoặc thay đổi dữ liệu đều phải xác thực `userId` để đảm bảo chỉ chủ sở hữu mới có quyền truy cập.**
  4.  **Tích hợp Google AI (Gemini):**
      -   Xây dựng service gọi AI, xử lý prompt (chỉ gồm audience và context property nếu có), AI sẽ tự động sinh title, USP và toàn bộ nội dung trang theo schema của template được chọn.

### Giai đoạn 2: Giao diện Người dùng (End-user UI)
- **Mục tiêu:** Xây dựng giao diện cho phép người dùng **sử dụng** các template có sẵn.
- **Công việc:**
  1.  **Thiết kế UI/UX:**
      -   Phác thảo luồng người dùng: **chọn template**, nhập đối tượng khách hàng mục tiêu (audience), preview, và publish.
      -   Thiết kế component cho sidebar quản lý và tab trong từng property.
  2.  **Xây dựng UI Tạo Trang sản phẩm:**
      -   Giao diện cho phép người dùng **chọn một trong các template có sẵn**.
      -   Form "tạo nhanh" chỉ nhập audience (đối tượng khách hàng mục tiêu).
      -   Giao diện chỉnh sửa chi tiết cho phép tùy chỉnh nội dung của các section đã được định nghĩa trong template.
  3.  **Xây dựng UI Quản lý:**
      -   Component sidebar "Trang sản phẩm" để quản lý các trang **đã tạo**.
      -   Component tab "Trang sản phẩm" trong trang chi tiết property.

### Giai đoạn 3: Giao diện Public & Tối ưu (Public UI & Optimization)
- **Mục tiêu:** Hiển thị trang sản phẩm cho người dùng cuối và tối ưu hóa hiệu năng.
- **Công việc:**
  1.  **Render Trang Public:**
      -   Tạo route động `/products/[slug]` để render trang sản phẩm từ dữ liệu Firestore.
      -   Xây dựng các component React tương ứng với từng `section type` (ví dụ: Hero, Gallery, Features).
  2.  **Tối ưu Performance & SEO:**
      -   Áp dụng SSG/ISR để tối ưu tốc độ tải trang.
      -   Tự động sinh metadata, canonical URL, và OG image.
  3.  **Tích hợp Style & Animation:**
      -   Áp dụng theme và animation cho các component section để tạo trải nghiệm ấn tượng.

### Giai đoạn 4: Hoàn thiện & Chuẩn bị Mở rộng
- **Mục tiêu:** Xử lý các trường hợp ngoại lệ và đảm bảo kiến trúc sẵn sàng cho tương lai.
- **Công việc:**
  1.  **Xử lý Edge Cases:**
      -   Validate dữ liệu, xử lý lỗi từ AI, xử lý logic khi property bị xóa.
  2.  **Hoàn thiện tính năng:**
      -   Bổ sung các tiện ích: copy link, xem analytics cơ bản.
  3.  **Chuẩn bị cho tương lai (Kiến trúc):**
      -   Đảm bảo kiến trúc hiện tại (với template hardcoded) được thiết kế mở, sẵn sàng cho việc bổ sung chức năng quản trị template trong các phiên bản sau mà không cần thay đổi lớn.

---

## 3. Kiến trúc & Kỹ thuật

### 3.1. Cấu trúc thư mục & Codebase
-   **Constants & Types:**
    -   `src/constants/product-templates.ts`: Chứa schema hardcoded của các template.
    -   `src/constants/product-themes.ts`: (Tùy chọn) Định nghĩa các biến theme cho từng template.
    -   `src/types/product-page.ts`: Định nghĩa các type, interface liên quan.
-   **Backend (tRPC):**
    -   `src/server/api/routers/product-page.ts`: Chứa các procedures tRPC.
-   **Frontend Components:**
    -   `src/components/page-product/`: Chứa các component chuyên biệt cho trang sản phẩm (sections, forms, management UI).
    -   `src/styles/product/`: (Tùy chọn) Chứa các file CSS module hoặc style config.
-   **Public Page & Assets:**
    -   `src/app/(public-pages)/products/[slug]/page.tsx`: Route render trang sản phẩm public (URL: /products/[slug]).
    -   `src/app/property-pages/page.tsx`: Trang dashboard quản lý tất cả trang sản phẩm của user.
    -   `src/app/property-pages/add/page.tsx`: Trang tạo mới product page (trang sản phẩm).
    -   **Lưu ý về assets sản phẩm:**
        -   Ảnh, video, file sản phẩm **không lưu trong thư mục public/**.
        -   Tất cả file sản phẩm được lưu ở Firebase Storage ở chế độ private.
        -   Khi user cần truy cập file, frontend sẽ gọi API backend. Backend kiểm tra quyền, sau đó tải file từ Firebase Storage và stream về cho user (proxy backend).
        -   Không bao giờ trả về link public hoặc signed URL cho file sản phẩm.
        -   Có thể log, kiểm soát, và áp dụng các chính sách bảo mật, chống tải hàng loạt/chôm hàng.
-   **Libraries & Helpers:**
    -   `src/lib/animation/`: (Tùy chọn) Chứa các helper hoặc config cho framer-motion.

### 3.2. Mô hình dữ liệu

#### Firestore Collection: `productPages`
Mỗi document sẽ đại diện cho một trang sản phẩm đã được tạo.
```json
{
  "userId": "string", // ID của người dùng sở hữu trang sản phẩm này
  "propertyId": "string",
  "templateId": "string",
  "slug": "string",
  "status": "draft" | "published" | "unlisted",
  "audience": "string", // input của user
  "title": "string",    // do AI sinh ra
  "usp": "string",      // do AI sinh ra
  "content": {
    "hero": { "..."},
    "features": { "..." }
  },
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

#### Ví dụ JSON Schema của một Template
Đây là cấu trúc được định nghĩa trong `src/constants/product-templates.ts`.
```json
{
  "id": "modern-apartment-01",
  "name": "Căn hộ hiện đại",
  "description": "Template cho căn hộ hiện đại, phù hợp gia đình trẻ.",
  "thumbnail": "/product-assets/template-modern.png",
  "sections": [
    {
      "id": "hero",
      "type": "hero",
      "name": "Hero Banner",
      "required": true,
      "fields": [
        { "key": "title", "type": "string", "label": "Tiêu đề chính", "required": true },
        { "key": "subtitle", "type": "string", "label": "Mô tả ngắn" },
        { "key": "image", "type": "image", "label": "Ảnh nền" }
      ]
    },
    {
      "id": "features",
      "type": "features",
      "name": "Tiện ích nổi bật",
      "fields": [
        { "key": "items", "type": "array", "itemType": "string", "label": "Danh sách tiện ích" }
      ]
    }
  ]
}
```

---

## 4. Tiêu chí hoàn thành (Definition of Done)

- [ ] **Chức năng:**
  - [ ] Tạo được trang sản phẩm qua luồng "siêu nhanh" (chỉ nhập audience).
  - [ ] Chỉnh sửa được nội dung từng section.
  - [ ] Publish/Unpublish được trang sản phẩm.
  - [ ] Quản lý tập trung qua sidebar và trong từng property.
  - [ ] Trang public (`/products/:slug`) render đúng nội dung và layout theo template.
- [ ] **Phi chức năng:**
  - [ ] Trang public có điểm Lighthouse (Performance) trên 85.
  - [ ] Giao diện responsive trên mobile, tablet, và desktop.
  - [ ] Dữ liệu được validate cẩn thận ở cả client và server.
  - [ ] **Logic phân quyền được áp dụng: Người dùng chỉ thấy và quản lý được trang sản phẩm của chính mình.**
  - [ ] Xử lý lỗi (từ AI, API) một cách tường minh cho người dùng.
- [ ] **Tài liệu:**
  - [ ] Code được comment rõ ràng ở những phần logic phức tạp.
  - [ ] Tài liệu này được cập nhật nếu có thay đổi lớn trong kế hoạch.
