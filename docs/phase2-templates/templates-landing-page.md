# Phân tích và Kế hoạch Tích hợp Hệ thống Landing Page Template

> Tài liệu này phân tích file HTML mẫu, đồng thời đề xuất một kế hoạch chi tiết và có khả năng mở rộng để tích hợp một **hệ thống render template** vào Prop-Mate, không chỉ giới hạn ở một mẫu duy nhất.

---

## 1. Phân tích Template Mẫu (Case Study)

File HTML mẫu là một ví dụ điển hình về landing page BĐS hiện đại.

-   **Công nghệ:** React, Tailwind CSS (qua CDN).
-   **Cấu trúc:** Gồm các section chính: Hero (tên, địa chỉ), Lưới ảnh, Mô tả, Thông số, và Sidebar dính chứa thông tin liên hệ và giá.
-   **Tính năng:** Modal xem ảnh, Modal form liên hệ, Animation khi cuộn.

=> **Kết luận phân tích:** Template này cung cấp một bộ yêu cầu tốt cho các "viên gạch" (component section) mà hệ thống của chúng ta cần có.

---

## 2. Chiến lược Tích hợp: Xây dựng Hệ thống Render Template

Thay vì code cứng một layout, chúng ta sẽ xây dựng một hệ thống linh hoạt gồm 3 thành phần chính:

1.  **Thư viện Component Section:** Một bộ sưu tập các component React có khả năng tùy biến cao (Hero, Gallery, Features, CTA, ...). Đây là các "viên gạch" xây dựng nên trang.
2.  **Schema Template:** Các file JSON định nghĩa một template là gì. Mỗi schema sẽ quy định cần dùng những "viên gạch" nào, theo thứ tự nào, và với các tùy chỉnh (dữ liệu, style) ra sao.
3.  **Bộ Render Động (Dynamic Renderer):** Một component React thông minh, có nhiệm vụ đọc schema và dữ liệu, sau đó tự động lắp ráp các "viên gạch" lại để tạo thành một trang landing page hoàn chỉnh.

**Lợi ích của mô hình này:**

-   **Tái sử dụng tối đa:** Các component section được viết một lần và dùng cho nhiều template.
-   **Mở rộng dễ dàng:** Tạo một template mới chỉ đơn giản là việc định nghĩa một file JSON mới.
-   **Bảo trì tập trung:** Cải thiện một component sẽ tự động nâng cấp cho tất cả các template sử dụng nó.

---

## 3. Kế hoạch Triển khai Chi tiết

### Bước 1: Xây dựng Thư viện Component Section Chung

-   **Mục tiêu:** Tạo ra các "viên gạch" React có thể tái sử dụng.
-   **Công việc:**
    1.  Xây dựng các component section dựa trên phân tích template mẫu và các nhu cầu tương lai. Mỗi component phải nhận `props` để hiển thị dữ liệu và các tùy chọn layout.
        -   `HeroSection.tsx`: Hỗ trợ ảnh/video nền, các kiểu layout chữ.
        -   `GallerySection.tsx`: Hỗ trợ kiểu lưới (grid), carousel, masonry.
        -   `FeaturesSection.tsx`: Hỗ trợ kiểu danh sách (list), kiểu thẻ (card).
        -   `DescriptionSection.tsx`, `StatsSection.tsx`, `CTASection.tsx`, `TestimonialsSection.tsx`, ...
    2.  Xây dựng các component tương tác: `ImageGalleryModal.tsx`, `ContactFormModal.tsx`.
-   **File liên quan (Tạo mới):**
    -   `src/components/page-landing/sections/...` (mỗi section một file)
    -   `src/components/page-landing/modals/...`

### Bước 2: Xây dựng Bộ Render Động

-   **Mục tiêu:** Tạo ra "cỗ máy" lắp ráp trang.
-   **Công việc:**
    1.  Tạo component `LandingPageRenderer.tsx`.
    2.  Component này nhận `props` là một mảng các `sections`.
    3.  Sử dụng một `switch` hoặc `object mapping` để đọc `section.type` và render component tương ứng từ thư viện ở Bước 1, truyền vào `section.data` làm props.
-   **File liên quan (Tạo mới):**
    -   `src/components/page-landing/LandingPageRenderer.tsx`

### Bước 3: Định nghĩa Schema và Hệ thống Theme

-   **Mục tiêu:** Tạo ra các "bản thiết kế" cho landing page.
-   **Công việc:**
    1.  Trong `src/constants/landing-templates.ts`, định nghĩa một mảng các object template.
    2.  Mỗi object template sẽ có: `id`, `name`, và một mảng `sections` định nghĩa cấu trúc.
    3.  (Nâng cao) Mỗi template có thể có một object `theme` chứa các biến CSS (`--primary-color`, `--font-family`) để `LandingPageRenderer` áp dụng, tạo ra bộ nhận diện riêng.
-   **File liên quan (Cập nhật):**
    -   `src/constants/landing-templates.ts`

### Bước 4: Tích hợp vào Trang Public `[slug]`

-   **Mục tiêu:** Hoàn thiện luồng từ URL đến trang landing page hoàn chỉnh.
-   **Công việc:**
    1.  Cập nhật trang `src/app/p/[slug]/page.tsx`.
    2.  Trang này sẽ gọi API tRPC để lấy dữ liệu của một landing page cụ thể.
    3.  Dữ liệu trả về sẽ chứa thông tin về `templateId` và `content` (dữ liệu cho từng section).
    4.  Trang sẽ truyền dữ liệu này vào component `LandingPageRenderer` để hiển thị trang.
    5.  Tích hợp các style và animation chung (ví dụ: `useScrollAnimation`) vào trang.
-   **File liên quan:**
    -   **Cập nhật:** `src/app/p/[slug]/page.tsx`
    -   **Tạo mới/Cập nhật:** `src/hooks/use-scroll-animation.ts`, `src/styles/landing/animations.css`

---

## 4. Kết luận

Cách tiếp cận này chuyển đổi yêu cầu từ "triển khai một trang" thành "xây dựng một hệ thống". Dù có vẻ phức tạp hơn ban đầu, nó mang lại sự linh hoạt, khả năng mở rộng và hiệu quả về lâu dài, cho phép chúng ta nhanh chóng tạo ra nhiều template đa dạng và ấn tượng trong tương lai mà không cần viết lại logic cốt lõi.
