import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdminDb";
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
  const user = await verifyFirebaseIdToken(req);
  if (!user) {
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
    const res = NextResponse.json(properties);
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  } catch (error) {
    console.error("[API /properties] GET error:", error);
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
  const user = await verifyFirebaseIdToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const now = new Date();
    const property: Omit<Property, "id"> = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await adminDb.collection("properties").add(property);
    const res = NextResponse.json({ id: docRef.id, ...property });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  } catch (error) {
    console.error("[API /properties] POST error:", error);
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
