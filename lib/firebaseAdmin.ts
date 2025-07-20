import { NextRequest } from "next/server";
import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Ưu tiên dùng GOOGLE_APPLICATION_CREDENTIALS_JSON nếu có
const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
  : undefined;

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
    return null;
  }
}
