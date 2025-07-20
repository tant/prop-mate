// app/test-firebase/page.tsx
"use client";
import { db, auth, storage } from "../../lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { ref, listAll } from "firebase/storage";
import { useEffect } from "react";

export default function TestFirebasePage() {
  useEffect(() => {
    const testEmail = process.env.NEXT_PUBLIC_FIREBASE_TEST_EMAIL || "";
    const testPassword = process.env.NEXT_PUBLIC_FIREBASE_TEST_PASSWORD || "";
    // Đăng nhập test (chỉ dùng cho dev, không để lộ tài khoản thật)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User signed in:", user.uid);
        testFirestore();
        testStorage();
      } else {
        signInWithEmailAndPassword(auth, testEmail, testPassword)
          .then((userCredential) => {
            console.log("Signed in as:", userCredential.user.email);
            testFirestore();
            testStorage();
          })
          .catch((error) => {
            console.error("Sign in error:", error);
          });
      }
    });

    // Test Firestore
    async function testFirestore() {
      try {
        const querySnapshot = await getDocs(collection(db, "test"));
        querySnapshot.forEach((doc) => {
          console.log("Firestore doc:", doc.id, doc.data());
        });
      } catch (e) {
        console.error("Firestore error:", e);
      }
    }

    // Test Storage
    async function testStorage() {
      try {
        const listRef = ref(storage, "/");
        const res = await listAll(listRef);
        console.log("Storage items:", res.items);
      } catch (e) {
        console.error("Storage error:", e);
      }
    }
  }, []);

  return (
    <main>
      <h1>Test Firebase Connection</h1>
      <ul>
        <li>✔️ Đăng nhập Firebase Auth bằng tài khoản test từ biến môi trường</li>
        <li>✔️ Đọc dữ liệu Firestore collection <b>test</b> (log kết quả ở console)</li>
        <li>✔️ Liệt kê file trong Firebase Storage root (log kết quả ở console)</li>
      </ul>
      <p>
        Kiểm tra <b>console log</b> để xem chi tiết kết quả từng bước.<br />
        <span>
          <b>Cách mở console:</b> Chrome/Edge: <code>Ctrl+Shift+J</code> (Windows/Linux), <code>Cmd+Option+J</code> (Mac).<br />
          Firefox: <code>Ctrl+Shift+K</code> (Windows/Linux), <code>Cmd+Option+K</code> (Mac).<br />
          Safari: <code>Cmd+Option+C</code> (Mac, cần bật Develop menu).
        </span>
      </p>
    </main>
  );
}
