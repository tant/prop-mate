# Hướng dẫn tích hợp Firebase vào dự án Next.js (TypeScript)

## 1. Tạo Project Firebase

1. Truy cập https://console.firebase.google.com/
2. Nhấn "Add project" (Tạo dự án mới), đặt tên và hoàn tất các bước theo hướng dẫn.
3. Sau khi tạo xong, vào trang quản lý project.

## 2. Kích hoạt các dịch vụ cần thiết

- **Authentication:**  
  Vào "Build" → "Authentication" → "Get started" → Bật "Email/Password".
  - **Tạo user test:**
    - Vào tab **Users** trong Authentication, nhấn **Add user**, nhập email và password để tạo tài khoản test.
    - Hoặc dùng code:
      ```js
      import { createUserWithEmailAndPassword } from "firebase/auth";
      createUserWithEmailAndPassword(auth, "email@example.com", "yourpassword")
        .then((userCredential) => console.log("User created:", userCredential.user.email));
      ```

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
  - **Cập nhật rule cho Storage:**
    - Vào tab **Rules** trong Storage.
    - Dán rule mẫu sau để chỉ cho phép user đã đăng nhập mới được đọc/ghi dữ liệu:
      ```plaintext
      rules_version = '2';
      service firebase.storage {
        match /b/{bucket}/o {
          match /{allPaths=**} {
            allow read, write: if request.auth != null;
          }
        }
      }
      ```
    - Nhấn **Publish** để áp dụng rule.
    - Không dùng rule `allow read, write: if true;` trên môi trường production.
  - **Thiết lập CORS cho Storage:**
    - Cài Google Cloud SDK: https://cloud.google.com/sdk/docs/install
    - Đăng nhập: `gcloud auth login`
    - Tạo file `cors.json` với nội dung:
      ```json
      [
        {
          "origin": ["http://localhost:3000"],
          "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
          "maxAgeSeconds": 3600,
          "responseHeader": ["Content-Type", "Authorizationg"]
        }
      ]
      ```
    - Áp dụng CORS cho bucket:
      ```sh
      gsutil cors set cors.json gs://<your-bucket-name>
      ```
    - **Cách lấy tên bucket:**
      - Vào Firebase Console → Storage → Get started.
      - Xem link hướng dẫn, sẽ có dạng `gs://[id dự án].appspot.com` hoặc `gs://[id dự án].firebasestorage.app`.
      - Sao chép đúng tên bucket này để dùng cho lệnh trên.

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
NEXT_PUBLIC_FIREBASE_BUCKET_URL=gs://[id dự án].appspot.com
NEXT_PUBLIC_FIREBASE_TEST_EMAIL=test@tantran.dev
NEXT_PUBLIC_FIREBASE_TEST_PASSWORD=123456
```
- Thay `[id dự án]` bằng id thực tế của project Firebase của bạn.
- Biến `NEXT_PUBLIC_FIREBASE_BUCKET_URL` dùng để lưu link bucket, có thể sử dụng khi thao tác với Storage hoặc cấu hình CORS.
- Thay bằng thông tin tài khoản test thực tế của bạn.

## 7. Kiểm tra kết nối

Thêm đoạn code test vào trang chủ hoặc một file bất kỳ:
```ts
import { db } from "../lib/firebaseConfig";
// Thử đọc/ghi Firestore hoặc chỉ console.log(db)
```

- Nếu gặp lỗi **Missing or insufficient permissions** với Firestore:
  - Đảm bảo đã đăng nhập đúng user (đã tạo ở bước trên).
  - Kiểm tra lại rule Firestore, đảm bảo cho phép user đã đăng nhập truy cập.
  - Đảm bảo collection bạn truy cập đã tồn tại.

- Nếu gặp lỗi **CORS** với Storage:
  - Đảm bảo đã thiết lập CORS như hướng dẫn ở trên.
  - Kiểm tra rule Storage cho phép user đã đăng nhập truy cập.

## 8. Đẩy code và kiểm tra lại trên môi trường dev

---

**Lưu ý:**
- Không dùng rule `allow read, write: if true;` trên production.
- Không public file `.env.local` lên git.
- Nếu cần hướng dẫn chi tiết từng dịch vụ hoặc gặp lỗi, hãy gửi log để được hỗ trợ.