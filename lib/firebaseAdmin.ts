import { NextRequest } from "next/server";
import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Chỉ dùng FIREBASE_SERVICE_ACCOUNT_BASE64 để lấy credentials
let credentials: any = undefined;
if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  try {
    const jsonStr = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf-8");
    credentials = JSON.parse(jsonStr);
  } catch (e) {
    console.error("[firebaseAdmin] Lỗi giải mã FIREBASE_SERVICE_ACCOUNT_BASE64:", e);
  }
}

if (!getApps().length) {
  initializeApp({
    credential: credentials ? cert(credentials) : applicationDefault(),
  });
}

export async function verifyFirebaseIdToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const idToken = authHeader.split(" ")[1];
  try {
    const decoded = await getAuth().verifyIdToken(idToken);
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
