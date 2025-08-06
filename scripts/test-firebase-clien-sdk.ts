// scripts/test-firebase-connection.ts
// Script kiểm tra helper Firebase

import 'dotenv/config';
import { db } from '../src/lib/firebase/client';
import { collection, addDoc, getDoc } from 'firebase/firestore';

console.log('FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

async function testFirebaseConnection() {
  try {
    // Thử ghi một document test
    const docRef = await addDoc(collection(db, 'test-connection'), {
      timestamp: new Date().toISOString(),
      status: 'ok',
    });
    console.log('Ghi thành công với ID:', docRef.id);

    // Thử đọc lại document vừa ghi
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Đọc thành công:', docSnap.data());
    } else {
      console.error('Không tìm thấy document vừa ghi!');
    }
  } catch (error) {
    console.error('Lỗi khi kết nối Firebase:', error);
  }
}

testFirebaseConnection();
