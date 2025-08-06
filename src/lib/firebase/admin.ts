import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import { getAppCheck } from 'firebase-admin/app-check';

// IMPORTANT: These environment variables are NOT prefixed with NEXT_PUBLIC_
// and should never be exposed to the client.
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // When copying the private key from your .env.local, the newlines are escaped.
  // We need to replace them back to actual newlines.
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
  throw new Error('Missing Firebase Admin credentials in environment variables');
}

// Cách sử dụng: Trong một API Route, bạn sẽ import: import { adminAuth } from '@/lib/firebase/admin';
// Initialize Firebase Admin SDK.
// Check if the app is already initialized to avoid errors during hot-reloading.

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();
const adminStorage = admin.storage();
const adminAppCheck = admin.appCheck ? admin.appCheck() : undefined; // App Check support (Firebase Admin SDK v11+)

/**
 * Xác thực App Check token (hỗ trợ replay protection):
 *
 * import { verifyAppCheckToken } from '@/lib/firebase/admin';
 *
 * // Đơn giản:
 * const claims = await verifyAppCheckToken(token);
 *
 * // Bật replay protection:
 * const claims = await verifyAppCheckToken(token, { consume: true });
 * if (claims.alreadyConsumed) {
 *   // Token đã bị dùng lại, từ chối request
 * }
 */
export async function verifyAppCheckToken(token: string, options?: { consume?: boolean }) {
  return getAppCheck().verifyToken(token, options);
}

/**
 * Hướng dẫn sử dụng Firebase Admin Helper:
 *
 * 1. Authentication:
 *    import { adminAuth } from '@/lib/firebase/admin';
 *    adminAuth.createUser(...), adminAuth.verifyIdToken(...), ...
 *
 * 2. Firestore Database:
 *    import { adminDb } from '@/lib/firebase/admin';
 *    adminDb.collection('users').doc('id').get(), ...
 *
 * 3. Storage:
 *    import { adminStorage } from '@/lib/firebase/admin';
 *    adminStorage.bucket().upload(...), ...
 *
 * 4. App Check (khuyên dùng helper verifyAppCheckToken):
 *    import { verifyAppCheckToken } from '@/lib/firebase/admin';
 *    const claims = await verifyAppCheckToken(token, { consume: true });
 *    if (claims.alreadyConsumed) { ... }
 *
 * 5. Nếu cần dùng các API khác:
 *    import { admin } from '@/lib/firebase/admin';
 *    admin.messaging(), admin.remoteConfig(), ...
 *
 * 6. Lưu ý:
 *    - Không import file này ở phía client (chỉ dùng cho server-side/API route).
 *    - Đảm bảo các biến môi trường đã được cấu hình đúng.
 *
 * 7. Genkit:
 *    // TODO: Bổ sung hướng dẫn khi tích hợp Genkit
 */

export { adminAuth, adminDb, adminStorage, adminAppCheck, admin };

