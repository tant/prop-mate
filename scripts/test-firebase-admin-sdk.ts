// scripts/test-firebase-admin-all.ts
// Test tổng hợp các dịch vụ Firebase Admin SDK: Firestore, Auth, Storage

import 'dotenv/config';
import { adminDb, adminAuth, adminStorage } from '../src/lib/firebase/admin';
import fs from 'fs';

async function testFirestore() {
  try {
    const docRef = adminDb.collection('test-admin-all').doc();
    await docRef.set({ timestamp: new Date().toISOString(), status: 'ok' });
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      console.log('Firestore OK:', docSnap.data());
    } else {
      console.error('Firestore FAIL');
    }
  } catch (e) {
    console.error('Firestore FAIL:', e);
  }
}

async function testAuth() {
  try {
    const user = await adminAuth.createUser({
      email: `testuser_${Date.now()}@example.com`,
      password: 'Test1234!'
    });
    console.log('Auth OK: Created user', user.uid);
    await adminAuth.deleteUser(user.uid);
  } catch (e) {
    console.error('Auth FAIL:', e);
  }
}

async function testStorage() {
  try {
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) throw new Error('FIREBASE_STORAGE_BUCKET env missing');
    const bucket = adminStorage.bucket(bucketName);
    const localPath = 'scripts/test-upload.txt';
    const remotePath = `test-uploads/test-upload-${Date.now()}.txt`;
    fs.writeFileSync(localPath, 'Hello Firebase Storage!');
    await bucket.upload(localPath, { destination: remotePath });
    console.log('Storage OK: Uploaded', remotePath);
    fs.unlinkSync(localPath);
  } catch (e) {
    console.error('Storage FAIL:', e);
  }
}

async function main() {
  await testFirestore();
  await testAuth();
  await testStorage();
}

main();
