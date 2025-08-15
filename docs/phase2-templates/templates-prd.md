# PRD: Trang Sản Phẩm (MVP)

> **Document Purpose:** Tài liệu này mô tả mục tiêu, phạm vi, quy trình và tiêu chí nghiệm thu cho tính năng Trang Sản Phẩm và tính năng tạo ra trang sản phẩm
> **MVP Focus:** Bản phát hành đầu tiên cung cấp cho người dùng khả năng tạo ra các trang sản phẩm để chào bán, marketing một cách đơn giản, thuận tiện và dễ dàng từ các template đã định nghĩa sẵn trong hệ thống. Quản trị template và đa ngôn ngữ nằm ngoài phạm vi MVP này. Giao diện và nội dung chỉ có tiếng Việt.

---

## 1. Thuật ngữ

Để đảm bảo rõ ràng và nhất quán, các thuật ngữ sau được định nghĩa:

-   **Template:** Một **bản thiết kế** hệ thống định nghĩa bố cục, các loại section và phong cách tổng thể. Template là **dùng chung** cho tất cả người dùng.
-   **Trang sản phẩm:** Một **trang web cụ thể, được sinh ra** từ Template. Mỗi Trang sản phẩm chứa dữ liệu riêng cho một bất động sản và do người dùng tạo/quản lý. Trang sản phẩm là **tài sản riêng tư** của người tạo, không ai khác có thể truy cập hoặc quản lý.

---

## 2. Mục tiêu & Định hướng

-   **Trao quyền cho người dùng:** Cho phép người dùng nhanh chóng tạo, quản lý và xuất bản nhiều trang sản phẩm đẹp mắt cho mỗi bất động sản.
-   **Marketing mục tiêu:** Cho phép tạo nhiều biến thể trang sản phẩm từ một bất động sản để nhắm đến các nhóm khách hàng khác nhau.
-   **Tối ưu quy trình:** Cung cấp 2 luồng tạo trang: AI siêu nhanh (user chỉ nhập đối tượng khách hàng, AI tự sinh tiêu đề và USP) và chỉnh sửa thủ công chi tiết. Hai quy trình này nối tiếp nhau: tạo bằng AI và có thể hoặc không cần chỉnh sửa thủ công rồi public.
-   **Đảm bảo chất lượng:** Tất cả trang sản phẩm sinh ra đều responsive, chuẩn SEO, dễ quản lý.

---

## 3. Phạm vi

### 3.1. Trong phạm vi (MVP)

-   **Template cứng:** 2-3 template định nghĩa sẵn, không thay đổi.
-   **Hai luồng tạo trang:**
    1.  **AI siêu nhanh:** User chỉ nhập đối tượng khách hàng mục tiêu (càng chi tiết càng tốt), AI sẽ tự động sinh tiêu đề (title) và USP phù hợp, sau đó sinh toàn bộ nội dung trang sản phẩm.
    2.  **Chỉnh sửa chi tiết:** Cho phép chỉnh sửa nội dung từng section sau khi AI sinh xong.
-   **Quản lý tập trung:** Có mục "Trang sản phẩm" riêng ở sidebar để người dùng quản lý **các trang của mình**.
-   **Quyền truy cập:** Trang sản phẩm có thể đặt là `Công khai` (tìm kiếm được) hoặc `Không công khai` (chỉ truy cập qua link trực tiếp).
-   **Chỉ tiếng Việt:** Giao diện và nội dung chỉ có tiếng Việt.

### 3.2. Ngoài phạm vi (MVP)

-   **Không quản trị template:** Không có UI tạo/sửa/xóa template.
-   **Không đa ngôn ngữ:** Không hỗ trợ nhiều ngôn ngữ.
-   **Không tính năng nâng cao:** Không versioning, A/B testing, bảo vệ mật khẩu, tích hợp bên thứ ba.
-   **Không quy trình phức tạp:** Không workflow phê duyệt nhiều bước, không lưu lịch sử chỉnh sửa.

---

## 4. Quy trình người dùng (Happy Path)

1.  **Khởi tạo:** Người dùng bấm "Tạo Trang sản phẩm mới" từ sidebar trung tâm hoặc từ trang chi tiết bất động sản.
2.  **Chọn:** Người dùng chọn bất động sản liên quan (nếu chưa có context) và chọn template.
3.  **Nhập liệu:** Người dùng chỉ cần nhập đối tượng khách hàng mục tiêu (càng chi tiết càng tốt).
4.  **Sinh trang:** Hệ thống gọi AI (Gemini) để tự động sinh tiêu đề (title), USP và toàn bộ nội dung trang sản phẩm dựa trên đối tượng khách hàng vừa nhập.
5.  **Xem trước & quyết định:** Sau khi sinh, người dùng xem trước và chọn:
    a.  **Xuất bản ngay.**
    b.  **Chỉnh sửa thủ công** trước khi xuất bản.
    c.  **Xóa & làm lại** để sinh lại bằng AI.
6.  **Xuất bản:** Người dùng cấu hình quyền truy cập (`Công khai`/`Không công khai`) và hệ thống sinh ra `slug` duy nhất. Trang được public tại `/p/[slug]`.
7.  **Quản lý:** Người dùng có thể tìm, lọc, quản lý các trang sản phẩm đã tạo tại dashboard quản lý tập trung (URL: `/property-pages`).

---

## 5. Yêu cầu kỹ thuật & chức năng

### 5.1. Template & Data Model (Cứng)

-   **Schema template:** Mỗi template là một object định nghĩa trong code, gồm metadata (id, name, thumbnail) và schema các section, slot, kiểu dữ liệu.
-   **Lưu trữ (Firestore):** Collection `propertyPages` lưu dữ liệu trang sản phẩm. Mỗi document gồm:
    -   `userId`: ID chủ sở hữu. **(Quan trọng cho kiểm soát truy cập)**
    -   `propertyId`: BĐS liên quan.
    -   `templateId`: ID template sử dụng.
    -   `status`: `draft` | `published` | `unlisted`.
    -   `slug`: Định danh duy nhất cho URL.
    -   `content`: JSON nội dung trang, kiểm tra theo schema template.
    -   `seo`: { `title`, `description`, `ogImageUrl` }.
    -   Timestamps (`createdAt`, `updatedAt`).

### 5.2. Tích hợp AI (Gemini)

-   **Prompt:** Prompt gửi cho AI chỉ gồm đối tượng khách hàng mục tiêu (càng chi tiết càng tốt) và context BĐS (nếu có). AI sẽ tự động sinh tiêu đề (title), USP và toàn bộ nội dung trang sản phẩm, trả về JSON đúng schema template.
-   **Chỉ sinh 1 lần:** AI chỉ dùng cho lần tạo đầu. Muốn sinh lại phải tạo trang mới. Đơn giản hóa workflow và kỳ vọng người dùng.

### 5.3. Xuất bản & hiển thị

-   **Cấu trúc URL:** Trang công khai tại `/p/[slug]`. Dashboard quản lý tại `/property-pages`.
-   **Hiệu năng:** Trang render SSG/ISR, TTFB < 500ms.
-   **SEO:**
    -   Trang công khai vào sitemap, được index.
    -   Trang không công khai có `noindex`, không vào sitemap.
    -   Ảnh OG mặc định là ảnh hero của BĐS.

### 5.4. Yêu cầu phi chức năng

-   **Hiệu năng:** Xuất bản/hủy xuất bản < 3 giây.
-   **Bảo mật:** API chỉ cho phép truy cập/sửa dữ liệu nếu đúng `userId` chủ sở hữu.
-   **Mở rộng:** Kiến trúc module, dễ thêm hệ thống quản trị template sau này.
-   **Truy cập:** Trang sinh ra đạt chuẩn WCAG AA.

---

## 6. Tiêu chí nghiệm thu

-   Người dùng tạo thành công trang sản phẩm với luồng AI siêu nhanh (chỉ nhập đối tượng khách hàng mục tiêu, AI tự sinh title và USP).
-   Người dùng xem và quản lý **chỉ các trang sản phẩm của mình** tại dashboard `/property-pages`.
-   Hệ thống ngăn đúng việc truy cập hoặc quản lý trang sản phẩm của người khác.


