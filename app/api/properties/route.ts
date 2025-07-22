import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyFirebaseIdToken } from "@/lib/firebaseAdmin";
import { propertyFromDoc, propertyToFirestore, Property } from "@/models/property";

// Helper: Set CORS headers
function setCORS(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

// GET /api/properties - List all properties (with pagination)
export async function GET(req: NextRequest) {
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /properties] Error verifying token:", err);
  }
  if (!user) {
    return setCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const startAfterParam = searchParams.get("startAfter");
    let query = adminDb.collection("properties").orderBy("createdAt", "desc");
    if (limitParam) query = query.limit(Number(limitParam));
    if (startAfterParam) query = query.startAfter(Number(startAfterParam));
    const snapshot = await query.get();
    const properties = snapshot.docs.map((doc) => propertyFromDoc({ id: doc.id, ...doc.data() }));
    return setCORS(NextResponse.json(properties));
  } catch (error) {
    console.error("[API /properties] GET error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return setCORS(NextResponse.json({ error: message }, { status: 500 }));
  }
}

// POST /api/properties - Create new property
export async function POST(req: NextRequest) {
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /properties] Error verifying token:", err);
  }
  if (!user) {
    return setCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    const data = await req.json();
    const now = new Date();
    const property: Omit<Property, "id"> = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await adminDb.collection("properties").add(propertyToFirestore ? propertyToFirestore(property) : property);
    return setCORS(NextResponse.json({ id: docRef.id, ...property }));
  } catch (error) {
    console.error("[API /properties] POST error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return setCORS(NextResponse.json({ error: message }, { status: 500 }));
  }
}

// OPTIONS /api/properties - Preflight
export async function OPTIONS() {
  return setCORS(new NextResponse(null, { status: 204 }));
}
