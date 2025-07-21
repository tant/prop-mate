import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { propertyFromDoc, propertyToFirestore, Property } from "@/models/property";
import { verifyFirebaseIdToken } from "@/lib/firebaseAdmin";

// Helper: CORS
function setCORS(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

// GET /api/properties - list all properties (with pagination)
export async function GET(req: NextRequest) {
  console.log("[API /properties] Incoming GET request", {
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
  });
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
    console.log("[API /properties] User after verifyFirebaseIdToken:", user);
  } catch (err) {
    console.error("[API /properties] Error verifying token:", err, {
      errorType: typeof err,
      errorString: String(err),
      errorStack: err instanceof Error ? err.stack : undefined,
      envProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      envAdminProjectId: process.env.GOOGLE_CLOUD_PROJECT,
      hasServiceAccount: !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
      serviceAccountStart: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.slice(0, 100),
    });
  }
  if (!user) {
    console.warn("[API /properties] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const startAfterParam = searchParams.get("startAfter");
    let q = adminDb.collection("properties").orderBy("createdAt", "desc");
    if (limitParam) q = q.limit(Number(limitParam));
    // Pagination: startAfter expects a value of createdAt (timestamp)
    if (startAfterParam) q = q.startAfter(Number(startAfterParam));
    const snapshot = await q.get();
    const properties = snapshot.docs.map((doc) => propertyFromDoc({ id: doc.id, ...doc.data() }));
    console.log("[API /properties] GET success, count:", properties.length);
    const res = NextResponse.json(properties);
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  } catch (error) {
    console.error("[API /properties] GET error:", error, error instanceof Error ? error.stack : undefined);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const res = NextResponse.json({ error: message }, { status: 500 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  }
}

// POST /api/properties - create new property
export async function POST(req: NextRequest) {
  console.log("[API /properties] Incoming POST request", {
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
  });
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
    console.log("[API /properties] User after verifyFirebaseIdToken:", user);
  } catch (err) {
    console.error("[API /properties] Error verifying token:", err, {
      errorType: typeof err,
      errorString: String(err),
      errorStack: err instanceof Error ? err.stack : undefined,
      envProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      envAdminProjectId: process.env.GOOGLE_CLOUD_PROJECT,
      hasServiceAccount: !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
      serviceAccountStart: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.slice(0, 100),
    });
  }
  if (!user) {
    console.warn("[API /properties] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    console.log("[API /properties] POST body:", data);
    const now = new Date();
    const property: Omit<Property, "id"> = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await adminDb.collection("properties").add(property);
    console.log("[API /properties] Property created with id:", docRef.id);
    const res = NextResponse.json({ id: docRef.id, ...property });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  } catch (error) {
    console.error("[API /properties] POST error:", error, error instanceof Error ? error.stack : undefined);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const res = NextResponse.json({ error: message }, { status: 500 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  }
}

// OPTIONS preflight
export async function OPTIONS() {
  return setCORS(new NextResponse(null, { status: 204 }));
}
