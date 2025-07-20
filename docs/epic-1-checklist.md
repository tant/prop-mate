# Checklist Epic 1: Foundation & Core Property Management

## Story 1.1: Project Setup & Firebase Integration
- [x] Khởi tạo dự án Next.js
- [x] Thiết lập cấu hình kết nối Firebase (Firestore, Auth, Storage)
- [x] Tạo trang chủ xác nhận dự án chạy thành công

## Story 1.2: Build Login/Logout Functionality
- [ ] Tạo trang đăng nhập với trường email/password
- [ ] Tích hợp đăng nhập với Firebase Authentication
- [ ] Xử lý chuyển hướng sau khi đăng nhập thành công
- [ ] Hiển thị thông báo lỗi khi đăng nhập thất bại
- [ ] Thêm chức năng đăng xuất

## Story 1.3: Display Property List
- [ ] Tạo Dashboard sau khi đăng nhập
- [ ] Hiển thị danh sách bất động sản (tên, giá, ảnh)
- [ ] Thêm nút "Thêm BĐS mới" nổi bật

## Story 1.4: Add a New Property
- [ ] Tạo form thêm bất động sản mới
- [ ] Đảm bảo form có đầy đủ các trường dữ liệu cần thiết
- [ ] Cho phép upload nhiều ảnh
- [ ] Lưu dữ liệu và ảnh lên Firestore/Firebase Storage
- [ ] Hiển thị bất động sản mới trong danh sách sau khi lưu

## Story 1.5: View & Edit Property Details
- [ ] Tạo trang chi tiết bất động sản
- [ ] Hiển thị đầy đủ thông tin bất động sản
- [ ] Thêm nút "Chỉnh sửa" để cập nhật thông tin
- [ ] Xử lý cập nhật dữ liệu lên Firestore

## Story 1.6: Delete a Property
- [ ] Thêm chức năng xóa bất động sản
- [ ] Hiển thị hộp thoại xác nhận trước khi xóa
- [ ] Xóa bất động sản khỏi Firestore và cập nhật lại danh sách
