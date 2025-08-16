# Phase 2: Trang sản phẩm theo Template (MVP)

### **Tác giả**: Qwen Code Assistant  
### **Ngày**: 15/08/2025  
### **Phiên bản**: 1.0  

## **1. Mục tiêu**

Xây dựng một hệ thống cho phép người dùng (môi giới bất động sản) **tạo, quản lý và xuất bản các trang sản phẩm (landing page)** một cách nhanh chóng và chuyên nghiệp bằng cách **chọn từ các mẫu có sẵn (template)** và **sử dụng AI để sinh nội dung ban đầu**.

## **2. Phạm vi (MVP)**

Phiên bản MVP tập trung vào:

-   **Template cứng:** 2 template được định nghĩa sẵn trong code.
-   **Luồng tạo trang:** AI siêu nhanh (chỉ nhập đối tượng khách hàng) + Chỉnh sửa chi tiết.
-   **Quản lý tập trung:** Dashboard và tab trong trang chi tiết BĐS.
-   **Quyền truy cập:** Trang sản phẩm có thể `Công khai` hoặc `Không công khai`.
-   **Chỉ tiếng Việt:** Giao diện và nội dung chỉ có tiếng Việt.

## **3. Kiến trúc & Công nghệ**

-   **Frontend:** Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS 4.
-   **UI Components:** shadcn/ui, Radix UI.
-   **State Management:** TanStack Query (React Query) cho client state, tRPC cho server state.
-   **Backend:** tRPC, Firebase (Firestore, Auth, Storage), Google AI (Gemini).
-   **Animation:** Framer Motion.
-   **Build Tool:** pnpm.

## **4. Những gì đã làm**

### **4.1. Giai đoạn 1: Nền tảng & Dữ liệu (Backend/API)**

-   **Định nghĩa Template Cố định:**
    -   Tạo 2 template mẫu trong `src/constants/product-templates.ts`: `modern-apartment-01` và `investor-focused-01`.
    -   Mỗi template định nghĩa các section và field với schema Zod.
-   **Thiết kế Data Contract & API tRPC:**
    -   Định nghĩa schema Zod cho `ProductPage`, `Template`, `Content`.
    -   Tạo tRPC router `productPage` với các API:
        -   `getTemplates`: Lấy danh sách template.
        -   `create`: Tạo trang sản phẩm mới (gọi AI, lưu vào Firestore).
        -   `getById`: Lấy thông tin chi tiết trang sản phẩm (bảo mật theo user).
        -   `getBySlug`: Lấy trang sản phẩm theo slug (cho public page).
        -   `update`: Cập nhật nội dung trang sản phẩm (bảo mật theo user).
        -   `getByUser`: Lấy danh sách trang sản phẩm của user.
        -   `getByProperty`: Lấy danh sách trang sản phẩm theo property ID.
-   **Tích hợp Google AI (Gemini):**
    -   Tạo service `generateProductPageContent` để gọi Gemini API.
    -   Xây dựng prompt dựa trên `templateId` và `audience` để AI sinh nội dung phù hợp.
    -   Xử lý lỗi từ AI và trả về thông báo cho client.

### **4.2. Giai đoạn 2: Giao diện Người dùng (Frontend UI)**

-   **Tạo/Cập nhật Layout cho các trang chính:**
    -   `/property-pages`: Dashboard quản lý tất cả trang sản phẩm của user.
    -   `/property-pages/add`: Trang tạo mới product page.
    -   `/property-pages/[id]/edit`: Trang chỉnh sửa chi tiết nội dung.
    -   `/properties/[id]`: Thêm tab "Trang sản phẩm" vào trang chi tiết BĐS.
-   **Xây dựng UI Tạo Trang sản phẩm (Luồng Siêu Nhanh):**
    -   Component `TemplateSelector`: Hiển thị danh sách template với thumbnail và mô tả.
    -   Form nhập `audience`: Cho phép người dùng nhập đối tượng khách hàng mục tiêu.
    -   Tích hợp gọi API `productPage.create` khi click "Tạo nhanh với AI".
    -   Chuyển hướng sang trang edit sau khi tạo thành công.
-   **Xây dựng UI Quản lý Trang sản phẩm:**
    -   Component `ProductPagesList`: Hiển thị danh sách trang sản phẩm trong dashboard.
    -   Component `PropertyProductPagesList`: Hiển thị danh sách trang liên quan trong tab của property.
    -   Tích hợp API `productPage.getByUser` và `productPage.getByProperty` để load dữ liệu.
    -   Nút "Chỉnh sửa" và "Tạo Trang Mới" để điều hướng.
-   **Hoàn thiện trang chỉnh sửa chi tiết (`/edit`)**:
    -   Fetch dữ liệu trang từ API `productPage.getById`.
    -   Hiển thị form cho phép chỉnh sửa tiêu đề, USP và nội dung từng section dựa trên schema template.
    -   Hành động: **Lưu bản nháp**, **Publish**, **Unpublish**, **Preview**, **Copy link**.
    -   Tích hợp API `productPage.update` để lưu thay đổi.

### **4.3. Giai đoạn 3: Giao diện Public & Tối ưu**

-   **Render Trang Public:**
    -   Tạo route động `/products/[slug]` để render trang sản phẩm public.
    -   Tạo component `ProductPageRenderer` để render nội dung động dựa trên template.
    -   Tạo các component section như `HeroSection`, `FeaturesSection`, `DescriptionSection`, `ImageSection`.
    -   Fetch dữ liệu từ API `productPage.getBySlug` với server-side rendering (SSR).
-   **Tối ưu Performance & SEO:**
    -   Cấu hình ISR (Incremental Static Regeneration) với `export const revalidate = 3600`.
    -   Tự động sinh metadata (title, description) cho SEO với hàm `generateMetadata`.
    -   (Chưa làm) Tự động sinh OG image.
-   **Tích hợp Style & Animation:**
    -   Áp dụng theme và style từ `docs/design-system.md`.
    -   Thêm animation với **Framer Motion**:
        -   Fade-in khi cuộn đến (scroll animation).
        -   Staggered animations cho danh sách items.
        -   Hover effects cho các element tương tác.
-   **Xử lý Asset An Toàn:**
    -   Tạo API route proxy `/api/storage-proxy` để phục vụ ảnh/video từ Firebase Storage một cách an toàn.
    -   Cập nhật các component section để sử dụng proxy URL thay vì URL trực tiếp.

### **4.4. Giai đoạn 4: Hoàn thiện & Chuẩn bị Mở rộng**

-   **Xử lý Edge Cases:**
    -   **Xử lý lỗi từ AI:** Hiển thị thông báo lỗi rõ ràng nếu AI không tạo được nội dung.
    -   **Dữ liệu đầu vào:** Validate `audience` và các field khác ở cả client và server.
    -   **Slug trùng lặp:** Tự động tạo slug duy nhất với hàm `generateUniqueSlug`.
    -   **Xóa dữ liệu liên quan:** (Đã làm một phần) Khi BĐS bị `inactivate` (status = `INACTIVE`), tự động `unlist` tất cả các trang sản phẩm liên quan.
-   **Hoàn thiện tính năng:**
    -   **Publish/Unpublish:** Đã có trong trang edit.
    -   **Preview:** Mở tab mới với URL public.
    -   **Copy link:** Thêm nút "Copy link" trong danh sách và trang edit.
    -   **Xem analytics cơ bản:** (Có thể bổ sung sau) Hiển thị ngày tạo, ngày cập nhật.
-   **Chuẩn bị cho tương lai (Kiến trúc):**
    -   Kiến trúc hiện tại (với template hardcoded) đã được thiết kế mở, sẵn sàng cho việc bổ sung chức năng quản trị template trong các phiên bản sau.

## **5. Các tính năng chính đã hoàn thành**

| Tính năng | Trạng thái | Ghi chú |
| :--- | :--- | :--- |
| **Tạo trang sản phẩm nhanh (AI)** | ✅ | Chọn template, nhập audience, gọi AI, chuyển sang edit |
| **Quản lý trang sản phẩm** | ✅ | Dashboard và tab trong property |
| **Chỉnh sửa chi tiết nội dung** | ✅ | Form động theo schema template |
| **Publish/Unpublish** | ✅ | Trong trang edit |
| **Preview trang** | ✅ | Mở tab mới với URL public |
| **Copy link** | ✅ | Trong danh sách và trang edit |
| **Trang public** | ✅ | Render nội dung theo template, SEO, animation |
| **Bảo mật tài sản số** | ✅ | Proxy backend cho ảnh/video |
| **Xử lý BĐS inactivate** | ✅ | Tự động unlist trang khi BĐS bị inactivate |

## **6. Hướng dẫn sử dụng cơ bản**

1.  **Tạo trang mới:**
    -   Truy cập *Sidebar > Trang sản phẩm* hoặc từ *Trang chi tiết BĐS > Tab Trang sản phẩm > Tạo Trang Mới*.
    -   Chọn một template.
    -   Nhập *Đối tượng khách hàng mục tiêu*.
    -   Click *Tạo nhanh với AI*.
    -   Hệ thống sẽ tạo trang và chuyển sang trang chỉnh sửa.

2.  **Chỉnh sửa nội dung:**
    -   Trong trang edit, điều chỉnh các trường trong form.
    -   Click *Lưu bản nháp*, *Publish*, hoặc *Unpublish*.

3.  **Quản lý trang:**
    -   Xem danh sách trang trong *Dashboard Trang sản phẩm* hoặc *Tab Trang sản phẩm* trong trang chi tiết BĐS.
    -   Click *Chỉnh sửa* để vào trang edit.
    -   Click *Copy link* để sao chép URL public.

4.  **Truy cập trang public:**
    -   Truy cập URL `/products/[slug]` để xem trang đã xuất bản.
    -   Dùng nút *Preview* trong trang edit để xem trước.

## **7. Các file/thư mục chính được tạo/thay đổi**

-   **Routes:**
    -   `src/app/(prop-mate-app)/property-pages/page.tsx` (Dashboard)
    -   `src/app/(prop-mate-app)/property-pages/add/page.tsx` (Tạo mới)
    -   `src/app/(prop-mate-app)/property-pages/[id]/edit/page.tsx` (Chỉnh sửa)
    -   `src/app/(prop-mate-app)/properties/[id]/page.tsx` (Thêm tab)
    -   `src/app/(public-pages)/products/[slug]/page.tsx` (Public page)
    -   `src/app/api/storage-proxy/route.ts` (Proxy API)
-   **Components:**
    -   `src/components/page-product/TemplateSelector.tsx`
    -   `src/components/page-product/ProductPagesList.tsx`
    -   `src/components/page-product/PropertyProductPagesList.tsx`
    -   `src/components/page-product/ProductPageRenderer.tsx`
    -   `src/components/page-product/sections/*.tsx` (Hero, Features, ...)
-   **Constants & Types:**
    -   `src/constants/product-templates.ts`
    -   `src/types/product-page.ts`
-   **Libraries & Services:**
    -   `src/lib/product-page.ts` (Hàm tiện ích)
    -   `src/lib/storage-proxy.ts` (Hàm tạo proxy URL)
    -   `src/server/lib/services/product-page-ai-service.ts` (Service gọi AI)
-   **APIs:**
    -   `src/server/api/routers/product-page.ts` (Các procedure tRPC)

## **8. Kế hoạch cho các phiên bản tiếp theo**

-   **Quản trị Template:** Cho phép user tạo/chỉnh sửa template riêng.
-   **Đa ngôn ngữ:** Hỗ trợ tiếng Anh và các ngôn ngữ khác.
-   **Tính năng nâng cao:** Versioning, A/B testing, bảo vệ bằng mật khẩu.
-   **Analytics:** Theo dõi lượt xem, tương tác trên trang sản phẩm.
-   **Workflow phê duyệt:** Cho các team lớn.