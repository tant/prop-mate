// lib/firebaseConfig.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
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

// Bật offline persistence cho Firestore với multi-tab
if (typeof window !== "undefined") {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Có thể do nhiều tab đang mở, persistence chỉ hoạt động trên một số tab
      console.warn("[Firestore] Offline persistence failed: nhiều tab đang mở.");
    } else if (err.code === 'unimplemented') {
      // Trình duyệt không hỗ trợ
      console.warn("[Firestore] Offline persistence không được hỗ trợ trên trình duyệt này.");
    } else {
      console.warn("[Firestore] Offline persistence error:", err);
    }
  });
}

export const storage: FirebaseStorage = getStorage(app);
export { app };
