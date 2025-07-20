# Hướng dẫn tích hợp Firebase vào dự án Next.js (TypeScript)

## 1. Tạo Project Firebase

1. Truy cập https://console.firebase.google.com/
2. Nhấn "Add project" (Tạo dự án mới), đặt tên và hoàn tất các bước theo hướng dẫn.
3. Sau khi tạo xong, vào trang quản lý project.

## 2. Kích hoạt các dịch vụ cần thiết

- **Authentication:**  
  Vào "Build" → "Authentication" → "Get started" → Bật "Email/Password".

- **Firestore Database:**  
  Vào "Build" → "Firestore Database" → "Create database" →
    - Chọn **Production mode** (không chọn test mode).
    - Chọn vị trí (location) phù hợp với user (ví dụ: asia-southeast1).
    - Sau khi tạo xong, vào tab **Rules** để kiểm tra và chỉnh sửa rule bảo mật.
    - **Khuyến nghị:** Dán rule mẫu dưới đây để chỉ cho phép user đã đăng nhập mới được đọc/ghi dữ liệu:

      ```plaintext
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /{document=**} {
            allow read, write: if request.auth != null;
          }
        }
      }
      ```
      - Rule này yêu cầu user phải đăng nhập (authenticated) mới có thể truy cập dữ liệu.
      - Nếu muốn phân quyền chi tiết hơn, hãy chỉnh rule theo từng collection hoặc action.
      - Sau khi chỉnh rule, nhấn **Publish** để áp dụng.
      - Không dùng rule `allow read, write: if true;` trên môi trường production.
      - Có thể test rule bằng tab **Rules Playground** trong Firebase Console.

- **Storage:**  
  Vào "Build" → "Storage" → "Get started" → Chọn vị trí mặc định.
  - **Lưu ý:** Nếu muốn sử dụng Firebase Storage, bạn cần nâng cấp project lên gói **Blaze (Pay as you go)**. Gói miễn phí (Spark) không hỗ trợ sử dụng Storage với các dự án production hoặc Next.js hosting.

## 3. Lấy thông tin cấu hình Firebase

1. Vào "Project settings" (biểu tượng bánh răng góc trái dưới logo Firebase).
2. Kéo xuống phần "Your apps" → Nhấn vào biểu tượng web (</>).
3. Đặt tên app, nhấn "Register app".
4. Sao chép đoạn cấu hình firebaseConfig (apiKey, authDomain, projectId, v.v.).

## 4. Cài đặt Firebase SDK cho dự án

Chạy lệnh sau trong thư mục dự án:
```zsh
npm install firebase
```

## 5. Tạo file cấu hình Firebase trong dự án (TypeScript)

Tạo file `firebaseConfig.ts` trong thư mục `/lib` hoặc gốc:
```ts
// lib/firebaseConfig.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
```

## 6. Thêm biến môi trường

Tạo file `.env.local` ở thư mục gốc dự án, dán các giá trị từ firebaseConfig:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## 7. Kiểm tra kết nối

Thêm đoạn code test vào trang chủ hoặc một file bất kỳ:
```ts
import { db } from "../lib/firebaseConfig";
// Thử đọc/ghi Firestore hoặc chỉ console.log(db)
```

## 8. Đẩy code và kiểm tra lại trên môi trường dev

---

**Lưu ý:**
- Khi chọn Production mode cho Firestore, mặc định rule sẽ chỉ cho phép truy cập khi đã xác thực (authenticated). Hãy kiểm tra và chỉnh sửa rule phù hợp với yêu cầu bảo mật của dự án.
- Không public file `.env.local` lên git.
- Nếu sử dụng Firebase Storage, bắt buộc phải nâng cấp lên gói Blaze (Pay as you go), Spark (free) không hỗ trợ production storage.

Nếu cần hướng dẫn chi tiết cho từng dịch vụ (Auth, Firestore, Storage) hoặc ví dụ code TypeScript, hãy yêu cầu thêm!