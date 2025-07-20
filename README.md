# PropMate: Real Estate Management App

## Mô tả
Ứng dụng quản lý bất động sản, khách hàng và lịch hẹn cho môi giới, ưu tiên trải nghiệm mobile-first, hỗ trợ offline, sử dụng Next.js, React, Firebase, OpenStreetMap.

## Cài đặt nhanh

```bash
git clone <repo-url>
cd prop-mate
npm install
cp .env.sample .env.local # Điền thông tin Firebase vào file này
```

## Hướng dẫn cấu hình Firebase
- Làm theo file `docs/make-firebase.md` để tạo project, lấy config, thiết lập rule bảo mật và Storage.
- Lưu ý: Muốn dùng Storage phải nâng cấp Firebase lên gói Blaze (Pay as you go).

## Chạy local
```bash
npm run dev
```
Truy cập http://localhost:3000

## Công nghệ sử dụng
- Next.js 15.4, React 19
- Firebase (Firestore, Auth, Storage)
- OpenStreetMap + Leaflet.js

## License
MIT
