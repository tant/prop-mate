# Epic 1: Foundation & Core Property Management

## Story 1.1: Project Setup & Firebase Integration
- **Mô tả:** Thiết lập cấu trúc dự án Next.js và kết nối với các dịch vụ Firebase đã chọn.
- **Tiêu chí hoàn thành (AC):**
  1. Dự án Next.js được khởi tạo thành công.
  2. Cấu hình kết nối Firebase hoàn chỉnh.
  3. Có trang chủ đơn giản xác nhận dự án chạy thành công.

## Story 1.2: Build Login/Logout Functionality
- **Mô tả:** Tạo màn hình đăng nhập và tích hợp với Firebase Authentication.
- **Tiêu chí hoàn thành (AC):**
  1. Có trang đăng nhập với trường email/password.
  2. Đăng nhập thành công bằng tài khoản tạo sẵn trên Firebase Console sẽ chuyển hướng về trang chính.
  3. Đăng nhập thất bại hiển thị thông báo lỗi thân thiện.
  4. Người dùng đã đăng nhập có thể đăng xuất.

## Story 1.3: Display Property List
- **Mô tả:** Tạo giao diện chính hiển thị danh sách các bất động sản đang quản lý.
- **Tiêu chí hoàn thành (AC):**
  1. Sau khi đăng nhập, người dùng thấy Dashboard.
  2. Trang này hiển thị danh sách bất động sản (tên, giá, ảnh).
  3. Có nút "Thêm BĐS mới" (Add New Property) nổi bật.

## Story 1.4: Add a New Property
- **Mô tả:** Xây dựng form để tạo hồ sơ bất động sản mới.
- **Tiêu chí hoàn thành (AC):**
  1. Nút "Thêm BĐS mới" mở form nhập liệu.
  2. Form bao gồm đầy đủ các trường dữ liệu đã định nghĩa.
  3. Người dùng có thể upload nhiều ảnh.
  4. Sau khi lưu, bất động sản mới xuất hiện trong danh sách.

## Story 1.5: View & Edit Property Details
- **Mô tả:** Cho phép người dùng xem chi tiết và cập nhật thông tin bất động sản.
- **Tiêu chí hoàn thành (AC):**
  1. Nhấn vào một bất động sản sẽ chuyển đến trang chi tiết.
  2. Trang chi tiết hiển thị đầy đủ thông tin.
  3. Có nút "Chỉnh sửa" cho phép cập nhật.

## Story 1.6: Delete a Property
- **Mô tả:** Cho phép người dùng xóa bất động sản.
- **Tiêu chí hoàn thành (AC):**
  1. Có chức năng xóa.
  2. Yêu cầu xác nhận trước khi xóa.
  3. Bất động sản bị xóa sẽ biến mất khỏi danh sách.
