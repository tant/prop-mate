import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { propertyFromDoc, Property } from "@/models/property";
import { verifyFirebaseIdToken } from "@/lib/firebaseAdmin";

// GET /api/properties/[id]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /properties/[id]] Error verifying token:", err);
  }
  if (!user) {
    console.warn("[API /properties/[id]] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const ref = adminDb.collection("properties").doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      console.warn("[API /properties/[id]] Not found:", id);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const res = NextResponse.json(propertyFromDoc({ id: snap.id, ...snap.data() }));
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  } catch (error) {
    console.error("[API /properties/[id]] GET error:", error, error instanceof Error ? error.stack : undefined);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/properties/[id]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /properties/[id]] Error verifying token:", err);
  }
  if (!user) {
    console.warn("[API /properties/[id]] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const ref = adminDb.collection("properties").doc(id);
    const data = await req.json();
    data.updatedAt = new Date();
    await ref.update(data);
    const res = NextResponse.json({ id, ...data });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  } catch (error) {
    console.error("[API /properties/[id]] PUT error:", error, error instanceof Error ? error.stack : undefined);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/properties/[id]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /properties/[id]] Error verifying token:", err);
  }
  if (!user) {
    console.warn("[API /properties/[id]] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const ref = adminDb.collection("properties").doc(id);
    await ref.delete();
    const res = NextResponse.json({ success: true });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  } catch (error) {
    console.error("[API /properties/[id]] DELETE error:", error, error instanceof Error ? error.stack : undefined);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH /api/properties/[id]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /properties/[id]] Error verifying token:", err);
  }
  if (!user) {
    console.warn("[API /properties/[id]] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const ref = adminDb.collection("properties").doc(id);
    const data = await req.json();
    data.updatedAt = new Date();
    await ref.update(data);
    const res = NextResponse.json({ id, ...data });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,PUT,PATCH,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  } catch (error) {
    console.error("[API /properties/[id]] PATCH error:", error, error instanceof Error ? error.stack : undefined);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// OPTIONS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
