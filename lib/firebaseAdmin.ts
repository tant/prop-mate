import { NextRequest } from "next/server";
import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Chỉ dùng FIREBASE_SERVICE_ACCOUNT_BASE64 để lấy credentials
let credentials: any = undefined;
if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  try {
    const jsonStr = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf-8");
    credentials = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error("[firebaseAdmin] Lỗi giải mã hoặc parse FIREBASE_SERVICE_ACCOUNT_BASE64: " + (e instanceof Error ? e.message : String(e)));
  }
}
if (credentials && credentials.type !== "service_account") {
  throw new Error("[firebaseAdmin] FIREBASE_SERVICE_ACCOUNT_BASE64 must be a service account key (type=service_account)");
}
if (!credentials) {
  throw new Error("[firebaseAdmin] FIREBASE_SERVICE_ACCOUNT_BASE64 is missing or invalid. Không thể khởi tạo Firebase Admin!");
}
const app = getApps().length ? getApp() : initializeApp({
  credential: cert(credentials),
});

export const adminDb = getFirestore(app);

export async function verifyFirebaseIdToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const idToken = authHeader.split(" ")[1];
  try {
    const decoded = await getAuth(app).verifyIdToken(idToken);
    return decoded;
  } catch (e) {
    return null;
  }
}
