# PRD: Landing Page theo Template cho từng Bất động sản (MVP)

> Tài liệu PRD này mô tả mục tiêu, phạm vi, luồng nghiệp vụ, yêu cầu chức năng/phi chức năng và tiêu chí chấp nhận cho tính năng Landing Page theo Template. Ở giai đoạn MVP, bỏ qua phân quyền và quản trị template; template được hardcode nhưng kiến trúc mở để bổ sung admin sau. Ngôn ngữ hiển thị cố định là tiếng Việt.

## 1. Out of Scope (Không nằm trong phạm vi MVP)
- Không hỗ trợ phân quyền, quản trị template, CRUD template.
- Không có i18n/đa ngôn ngữ, chỉ tiếng Việt.
- Không có versioning, rollback, regenerate landing page.
- Không có password protection, không có analytics nâng cao.
- Không có A/B testing, không có tích hợp bên thứ ba (CRM, email, v.v.).
- Không có lịch sử chỉnh sửa, không có workflow duyệt/publish nhiều bước.

## 2. Quản lý landing page tập trung qua sidebar (UX đề xuất)
• Thêm nav item riêng ở sidebar (ví dụ: “Landing Pages”, “Trang chào bán”) để quản lý tất cả landing page đã tạo.
• Tính năng: xem tổng quan, tìm kiếm, lọc, bulk action, analytics, truy cập nhanh về property hoặc edit landing page.
• Vẫn giữ tab “Landing Pages” trong từng property để thao tác theo ngữ cảnh BĐS.

## 3. Luồng tạo landing page siêu nhanh (3 trường)
• User chỉ cần nhập: Tiêu đề/Địa chỉ, Đối tượng khách hàng (audience), USP (điểm nổi bật nhất).
• AI chỉ generate 1 lần duy nhất toàn bộ nội dung landing page dựa trên 3 trường này + dữ liệu property (nếu có).
• Sau khi AI generate xong, user có 3 lựa chọn:
  - Dùng luôn (publish ngay)
  - Chỉnh sửa thủ công rồi publish
  - Xóa landing page này và tạo landing page mới để dùng AI lại từ đầu
• Không hỗ trợ regenerate từng section hoặc toàn bộ landing page.
• Prompt Gemini: “Hãy tạo nội dung marketing hấp dẫn cho landing page bất động sản với các thông tin: [title], [audience], [USP]. Nếu property có dữ liệu chi tiết (ảnh, giá, diện tích, tiện ích…), hãy tận dụng tối đa. Xuất ra JSON đúng schema template.”

## 4. Mục tiêu
• Cho phép user tạo, quản lý, xuất bản nhiều landing page cho mỗi BĐS, nhắm tới các nhóm audience khác nhau.
• Tối ưu thao tác: có thể tạo nhanh chỉ với 3 trường hoặc chỉnh chi tiết từng section nếu muốn.
• Đảm bảo landing page đẹp, responsive, SEO tốt, dễ quản lý tập trung.

## 5. Phạm vi (MVP)
• 2–3 template hardcoded, mỗi template định nghĩa section/slot rõ ràng (schema).
• Tạo landing page bằng 2 luồng: “siêu nhanh” (3 trường) hoặc “chỉnh chi tiết” (edit section).
• Access mode: Public/Unlisted .
• Quản lý tập trung qua sidebar + tab trong property.

### Enum đề xuất cho tone và audience
- **Tone:** sang_trong, gan_gui, dau_tu, nang_dong, yen_binh, custom
- **Audience:** gia_dinh_tre, nha_dau_tu, chuyen_gia, nguoi_lon_tuoi, doanh_nghiep, khach_nuoc_ngoai, custom
> UI cho chọn nhanh enum, cho phép nhập custom. Prompt AI truyền cả enum lẫn mô tả tiếng Việt.

## 6. Luồng người dùng (happy path)
• Từ sidebar “Landing Pages” hoặc tab trong property → “Tạo mới”.
• Chọn property (nếu từ sidebar), chọn template (hoặc mặc định).
• Chọn luồng: “Tạo nhanh” (3 trường) hoặc “Chỉnh chi tiết”.
• Nhập 3 trường (title, audience, USP) → Generate (AI chỉ sinh 1 lần) → Preview.
• User chọn: publish ngay, chỉnh sửa thủ công rồi publish, hoặc xóa để tạo landing page mới (AI generate lại từ đầu).
• Chọn access (Public/Unlisted), đặt slug (unique, không PII) → Publish.
• Quản lý, tìm kiếm, lọc, bulk action từ sidebar hoặc property.

## 7. Mô hình Template (hardcoded, schema rõ ràng)
• Template = metadata (id, name, mô tả, thumbnail) + danh sách section/slot (schema, required/optional, kiểu dữ liệu).
• AI sinh ra object {field: value} đúng schema, engine render thành landing page.
• Có thể mở rộng template về sau (CRUD, version, DB).

## 8. Dữ liệu và lưu trữ (Firestore)
• Collection: landingPages
  - propertyId, templateId, status: draft|published
  - slug (unique, không chứa PII)
  - tone (enum + custom), audience (enum + custom)
  - access: public|unlisted
  - sections: JSON nội dung theo template (đã validate)
  - seo: title, description, ogImageUrl
  - createdAt, updatedAt, publishedAt


## 9. Tích hợp AI (Google AI API – Gemini)
• Prompt gồm: snapshot property (nếu có), 3 trường nhập, enum tone/audience, yêu cầu output JSON đúng schema template.
• Nếu thiếu dữ liệu property, AI sinh nội dung trung tính hoặc để trống.
• Không hỗ trợ regenerate section hoặc toàn bộ landing page. Nếu muốn dùng AI lại, user phải xóa landing page này và tạo mới.
• Cache chỉ áp dụng cho lần generate đầu tiên.

## 10. Xuất bản & Render trang công khai
• URL: /p/:slug (unique, không PII)
• SSG/ISR (revalidate by tag/time)
• Access: Public (index, vào sitemap nếu canonical), Unlisted (noindex, không vào sitemap)
• SEO: metadata từ section, noindex đúng quy tắc
• OG image: heroImage/gallery[0]

## 11. Trải nghiệm chỉnh sửa (trong app)
• Preview WYSIWYG theo template
• Chỉnh nhanh text/bullets, reorder, chọn ảnh
• Không có regenerate section hoặc toàn bộ
• Gắn nhãn AI/manual
• Quản lý nhiều biến thể theo audience, canonical

## 12. Quy tắc slug và xuất bản
• Slug: shortid tự sinh (ví dụ: /p/abc123xy), đảm bảo unique, không chứa PII, không lộ thông tin nhạy cảm.
• Không chứa PII (số điện thoại, email...)
• Kiểm tra trùng slug, tự sinh lại nếu cần
• Publish: draft → published, cập nhật sitemap/ISR
• Unpublish: chuyển về draft, URL trả 404/410

## 13. Trường hợp biên & xử lý lỗi
• Thiếu dữ liệu property: báo field cần bổ sung, phần optional có thể ẩn/placeholder
• AI trả JSON lỗi: auto-fix nhẹ, nếu không được thì báo lỗi, user phải xóa và tạo mới để dùng AI lại
• Đổi dữ liệu property sau publish: gợi ý tạo landing page mới nếu muốn cập nhật nội dung AI
• Xoá property: landing page ẩn hoặc tombstone

## 14. Yêu cầu phi chức năng
• Publish/unpublish < 3s (cả revalidate), TTFB < 500ms khi đã ISR
• Nếu AI lỗi, user vẫn tự điền thủ công và publish
• Hợp đồng dữ liệu template rõ ràng, sẵn sàng tách DB, thêm admin
• Accessibility: AA, keyboard, alt text ảnh

## 15. Tiêu chí chấp nhận (Acceptance Criteria)
• User tạo landing page với 3 trường hoặc chỉnh chi tiết
• Tạo ≥2 biến thể audience cho 1 property, mỗi biến thể slug riêng, canonical đúng
• Chọn access Public/Unlisted, trang Unlisted không vào sitemap, có noindex
• Sửa section, preview, publish, copy link, bulk action
• Trang public responsive, SEO/OG đúng, canonical/noindex hoạt động

## 16. Lộ trình triển khai
• Sprint 1: Template registry (hardcoded), schema, prompt, UI tạo nhanh, preview, lưu draft
• Sprint 2: Publish, slug, SEO, sitemap, canonical, sidebar quản lý, bulk action
• Sprint 3: OG image, unpublish, A/B test, analytics

## 17. Nền tảng cho phần Admin sau này
• Template CRUD, version, DB
• Lịch sử chỉnh sửa, quyền publish/duyệt

## Checklist xác nhận
• Số lượng template MVP, style
• Field property bắt buộc
• Enum tone/audience, độ dài mô tả section
• CTA chính

---
Ghi chú: Ngôn ngữ luôn là tiếng Việt, không có locale/i18n trong MVP. Nếu cần chuyển sang template HTML + slot, chỉ cần cập nhật lại schema và data contract.


