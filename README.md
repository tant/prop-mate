# PropMate: Real Estate Management App

PropMate là ứng dụng quản lý bất động sản, khách hàng và lịch hẹn dành cho môi giới, ưu tiên trải nghiệm mobile-first, hỗ trợ offline, tích hợp Next.js, React, Firebase và OpenStreetMap.

---

## 🚀 Tính năng nổi bật
- Quản lý tài sản, khách hàng, lịch hẹn trực quan
- Tìm kiếm, lọc, xem chi tiết và bản đồ vị trí bất động sản
- Đồng bộ dữ liệu real-time với Firebase
- Đăng nhập, phân quyền, bảo mật dữ liệu
- Hỗ trợ offline-first, tối ưu cho thiết bị di động
- Giao diện hiện đại, dễ sử dụng

## 🛠️ Cài đặt nhanh
```bash
git clone <repo-url>
cd prop-mate
npm install
cp .env.sample .env.local # Điền thông tin Firebase vào file này
```

## 🔑 Cấu hình Firebase
1. Làm theo hướng dẫn tại [`docs/make-firebase.md`](docs/make-firebase.md) để tạo project, lấy config, thiết lập rule bảo mật và Storage.
2. Lưu ý: Để sử dụng Storage, cần nâng cấp Firebase lên gói Blaze (Pay as you go).

## ▶️ Chạy local
```bash
npm run dev
```
Truy cập: http://localhost:3000

## 🧩 Công nghệ sử dụng
- **Next.js 15.4**, **React 19**
- **Firebase** (Firestore, Auth, Storage)
- **OpenStreetMap** + **Leaflet.js**
- **TailwindCSS 4** (tích hợp sẵn với Next.js)

## ⚠️ Lưu ý về TailwindCSS
- Dự án sử dụng **TailwindCSS 4** (không dùng cú pháp, cấu hình, plugin cũ của Tailwind 3)
- Tham khảo tài liệu chính thức TailwindCSS 4 để đảm bảo code luôn tương thích

## 📄 License
MIT © 2025 PropMate Team
