import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdminDb";
import { propertyFromDoc, Property } from "@/models/property";
import { verifyFirebaseIdToken } from "@/lib/firebaseAdmin";

// @ts-expect-error Next.js App Router context has implicit any
export async function GET(req: NextRequest, context) {
  const { params } = context;
  const user = await verifyFirebaseIdToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const ref = adminDb.collection("properties").doc(params.id);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const res = NextResponse.json(propertyFromDoc({ id: snap.id, ...snap.data() }));
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  } catch (error) {
    console.error("[API /properties/[id]] GET error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// @ts-expect-error Next.js App Router context has implicit any
export async function PUT(req: NextRequest, context) {
  const { params } = context;
  const user = await verifyFirebaseIdToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const ref = adminDb.collection("properties").doc(params.id);
    const data = await req.json();
    data.updatedAt = new Date();
    await ref.update(data);
    const res = NextResponse.json({ id: params.id, ...data });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  } catch (error) {
    console.error("[API /properties/[id]] PUT error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// @ts-expect-error Next.js App Router context has implicit any
export async function DELETE(req: NextRequest, context) {
  const { params } = context;
  const user = await verifyFirebaseIdToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const ref = adminDb.collection("properties").doc(params.id);
    await ref.delete();
    const res = NextResponse.json({ success: true });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  } catch (error) {
    console.error("[API /properties/[id]] DELETE error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// OPTIONS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
