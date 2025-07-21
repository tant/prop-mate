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
    console.log("[firebaseAdmin] Đã giải mã FIREBASE_SERVICE_ACCOUNT_BASE64:", {
      project_id: credentials?.project_id,
      client_email: credentials?.client_email,
      private_key_id: credentials?.private_key_id,
      key_first_20: credentials?.private_key?.slice(0, 20),
    });
  } catch (e) {
    console.error("[firebaseAdmin] Lỗi giải mã FIREBASE_SERVICE_ACCOUNT_BASE64:", e);
  }
}
if (credentials && credentials.type !== "service_account") {
  console.error("[firebaseAdmin] Credential 'type' field is not 'service_account':", credentials.type);
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
    console.error("[verifyFirebaseIdToken] Error verifying token:", e, {
      errorType: typeof e,
      errorString: String(e),
      errorStack: e instanceof Error ? e.stack : undefined,
    });
    return null;
  }
}
