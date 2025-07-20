# Hướng dẫn cài đặt shadcn/ui cho PropMate (Next.js + TailwindCSS 4, TypeScript)

> **Lưu ý:** Không nên sửa file `globals.css` trước khi cài đặt shadcn/ui. Nếu đã chỉnh sửa, shadcn có thể detect cấu trúc hoặc inject style không chính xác, gây lỗi hoặc thiếu style. Hãy cài shadcn trước, sau đó mới tuỳ biến lại `globals.css`.

## 1. Cài đặt shadcn/ui

Chạy lệnh sau trong thư mục gốc dự án:

```bash
pnpm dlx shadcn@latest init
```
> Nếu dùng npm hoặc yarn, thay `pnpm dlx` bằng `npx` hoặc `yarn dlx` tương ứng.

- Chọn **Next.js** khi được hỏi loại project.
- Chọn **TypeScript** (không dùng JavaScript).
- Làm theo hướng dẫn trên màn hình để hoàn tất cấu hình.

## 2. Thêm component UI

Cài đặt các component dự kiến sẽ sử dụng trong app bằng lệnh sau:

```bash
npx shadcn@latest add button input label card avatar dialog alert form textarea select badge navigation-menu separator tooltip switch checkbox radio-group tabs sonner
```
- Các component sẽ được thêm vào thư mục `components/ui/` dưới dạng file `.tsx`.
- Có thể lặp lại lệnh trên với các component khác nếu cần.

### Mô tả các component đã cài đặt

- **button**: Nút bấm cơ bản cho các thao tác (submit, action, v.v.).
- **input**: Trường nhập liệu (text, email, password, ...).
- **label**: Nhãn cho các trường nhập liệu.
- **card**: Khối hiển thị nội dung dạng thẻ.
- **avatar**: Hiển thị hình đại diện người dùng.
- **dialog**: Hộp thoại (modal) cho xác nhận, thông báo, v.v.
- **alert**: Thông báo trạng thái (thành công, lỗi, cảnh báo, ...).
- **form**: Hỗ trợ xây dựng form nhập liệu.
- **textarea**: Trường nhập liệu nhiều dòng.
- **select**: Dropdown chọn giá trị.
- **badge**: Hiển thị nhãn nhỏ (trạng thái, tag, ...).
- **navigation-menu**: Menu điều hướng.
- **separator**: Đường phân cách nội dung.
- **tooltip**: Hiển thị chú thích khi hover.
- **switch**: Công tắc chuyển trạng thái (on/off).
- **checkbox**: Ô chọn nhiều.
- **radio-group**: Nhóm lựa chọn đơn (radio button).
- **tabs**: Giao diện chuyển đổi tab nội dung.
- **sonner**: Hiển thị toast notification (thông báo nổi ngắn gọn).

