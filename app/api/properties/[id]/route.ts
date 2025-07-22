import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyFirebaseIdToken } from "@/lib/firebaseAdmin";
import { propertyFromDoc } from "@/models/property";

// Helper: Set CORS headers
function setCORS(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,PUT,PATCH,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

// GET /api/properties/[id] - Get property by id
export async function GET(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /properties/[id]] Error verifying token:", err);
  }
  if (!user) {
    return setCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    const ref = adminDb.collection("properties").doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return setCORS(NextResponse.json({ error: "Not found" }, { status: 404 }));
    }
    return setCORS(NextResponse.json(propertyFromDoc({ id: snap.id, ...snap.data() })));
  } catch (error) {
    console.error("[API /properties/[id]] GET error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return setCORS(NextResponse.json({ error: message }, { status: 500 }));
  }
}

// PUT /api/properties/[id] - Update property
export async function PUT(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /properties/[id]] Error verifying token:", err);
  }
  if (!user) {
    return setCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    const ref = adminDb.collection("properties").doc(id);
    const data = await req.json();
    data.updatedAt = new Date();
    await ref.update(data);
    return setCORS(NextResponse.json({ id, ...data }));
  } catch (error) {
    console.error("[API /properties/[id]] PUT error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return setCORS(NextResponse.json({ error: message }, { status: 500 }));
  }
}

// PATCH /api/properties/[id] - Patch property
export async function PATCH(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /properties/[id]] Error verifying token:", err);
  }
  if (!user) {
    return setCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    const ref = adminDb.collection("properties").doc(id);
    const data = await req.json();
    data.updatedAt = new Date();
    await ref.update(data);
    return setCORS(NextResponse.json({ id, ...data }));
  } catch (error) {
    console.error("[API /properties/[id]] PATCH error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return setCORS(NextResponse.json({ error: message }, { status: 500 }));
  }
}

// DELETE /api/properties/[id] - Delete property
export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /properties/[id]] Error verifying token:", err);
  }
  if (!user) {
    return setCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    const ref = adminDb.collection("properties").doc(id);
    await ref.delete();
    return setCORS(NextResponse.json({ success: true }));
  } catch (error) {
    console.error("[API /properties/[id]] DELETE error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return setCORS(NextResponse.json({ error: message }, { status: 500 }));
  }
}

// OPTIONS /api/properties/[id] - Preflight
export async function OPTIONS() {
  return setCORS(new NextResponse(null, { status: 204 }));
}
