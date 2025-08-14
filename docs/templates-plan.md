# Kế hoạch triển khai Landing Page theo Template (theo PRD)

---

## Giai đoạn 1: Thiết kế & Chuẩn bị

1. **Phân tích & xác định schema template**
   - Xác định 2–3 template hardcoded (id, name, mô tả, thumbnail, schema section/slot).
   - Định nghĩa enum audience, tone, các trường bắt buộc/optional cho từng section.

2. **Thiết kế data contract**
   - Định nghĩa interface/type cho landing page, template, section, audience, tone (TypeScript).
   - Chuẩn hóa schema lưu trữ trên Firestore.

3. **Thiết kế UI/UX**
   - Phác thảo flow tạo nhanh (3 trường), chỉnh chi tiết, preview, publish.
   - Thiết kế sidebar quản lý landing page, tab trong property.

---

## Giai đoạn 2: Xây dựng nền tảng (Sprint 1)

4. **Tạo registry template (hardcoded)**
   - Tạo file constants/landing-templates.ts chứa danh sách template và schema.

5. **Tạo model & type**
   - Định nghĩa type cho landing page, template, section, enum (TypeScript, Zod).

6. **Xây dựng API backend (tRPC)**
   - API tạo landing page (POST): nhận 3 trường, propertyId, gọi AI, validate, lưu Firestore.
   - API lấy danh sách, chi tiết, xóa, publish/unpublish landing page.
   - API kiểm tra/tránh trùng slug.

7. **Tích hợp Google AI API (Gemini)**
   - Xây dựng hàm gọi AI, truyền prompt đúng format, validate output JSON theo schema.
   - Xử lý lỗi, auto-fix nhẹ, fallback nhập tay nếu AI lỗi.

---

## Giai đoạn 3: Xây dựng UI/UX (Sprint 1–2)

8. **UI tạo landing page siêu nhanh**
   - Form nhập 3 trường (title, audience, USP), chọn template, enum/custom.
   - Gọi API tạo landing page, hiển thị preview.

9. **UI chỉnh chi tiết section**
   - Cho phép chỉnh sửa từng section, reorder, chọn ảnh, gắn nhãn AI/manual.

10. **UI preview & publish**
    - Hiển thị preview WYSIWYG theo template.
    - Chọn access (public/unlisted), đặt slug, publish.

11. **Sidebar quản lý landing page**
    - Danh sách landing page, filter, tìm kiếm, bulk action, truy cập nhanh về property hoặc edit.

12. **Tab landing page trong property**
    - Quản lý landing page theo từng property.

---

## Giai đoạn 4: Render & SEO (Sprint 2)

13. **Trang public landing page**
    - Route /p/:slug, lấy data từ Firestore, render theo template.
    - SSG/ISR, revalidate by tag/time.
    - SEO: metadata, canonical, noindex cho unlisted, OG image.

14. **Xử lý publish/unpublish**
    - Đảm bảo trạng thái draft/published, cập nhật sitemap, trả 404/410 khi unpublish.

---

## Giai đoạn 5: Xử lý lỗi & edge case (Sprint 2–3)

15. **Xử lý lỗi AI, validate dữ liệu**
    - Nếu thiếu dữ liệu property, báo field cần bổ sung.
    - Nếu AI trả JSON lỗi, auto-fix nhẹ, nếu không được thì báo lỗi, cho phép nhập tay.

16. **Kiểm tra trùng slug, sinh lại nếu cần**
    - Đảm bảo slug unique, không chứa PII.

17. **Ẩn landing page khi property bị xóa**
    - Chuyển landing page sang trạng thái ẩn/tombstone.

---

## Giai đoạn 6: Hoàn thiện & mở rộng (Sprint 3+)

18. **Bulk action, copy link, analytics cơ bản**
    - Cho phép thao tác hàng loạt, copy link landing page.

19. **OG image, A/B test, analytics (nếu cần)**
    - Sinh OG image từ hero/gallery, chuẩn bị cho A/B test, analytics.

20. **Chuẩn bị mở rộng admin**
    - Đảm bảo kiến trúc sẵn sàng cho CRUD template, version, lịch sử chỉnh sửa, quyền publish/duyệt.

---

## Checklist xác nhận

- [ ] Đủ số lượng template MVP, style
- [ ] Đúng field property bắt buộc
- [ ] Enum tone/audience, độ dài mô tả section
- [ ] Đúng CTA chính
- [ ] Đáp ứng tiêu chí chấp nhận PRD
