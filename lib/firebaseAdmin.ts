import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Only initialize once
if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
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
