import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdminDb";
import { propertyFromDoc, Property } from "@/models/property";
import { verifyFirebaseIdToken } from "@/lib/firebaseAdmin";

// @ts-expect-error Next.js App Router context has implicit any
export async function GET(req: NextRequest, context) {
  const { params } = context;
  console.log("[API /properties/[id]] Incoming GET request", {
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    params,
  });
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
    console.log("[API /properties/[id]] User after verifyFirebaseIdToken:", user);
  } catch (err) {
    console.error("[API /properties/[id]] Error verifying token:", err);
  }
  if (!user) {
    console.warn("[API /properties/[id]] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const ref = adminDb.collection("properties").doc(params.id);
    const snap = await ref.get();
    if (!snap.exists) {
      console.warn("[API /properties/[id]] Not found:", params.id);
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

// @ts-expect-error Next.js App Router context has implicit any
export async function PUT(req: NextRequest, context) {
  const { params } = context;
  console.log("[API /properties/[id]] Incoming PUT request", {
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    params,
  });
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
    console.log("[API /properties/[id]] User after verifyFirebaseIdToken:", user);
  } catch (err) {
    console.error("[API /properties/[id]] Error verifying token:", err);
  }
  if (!user) {
    console.warn("[API /properties/[id]] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const ref = adminDb.collection("properties").doc(params.id);
    const data = await req.json();
    console.log("[API /properties/[id]] PUT body:", data);
    data.updatedAt = new Date();
    await ref.update(data);
    const res = NextResponse.json({ id: params.id, ...data });
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

// @ts-expect-error Next.js App Router context has implicit any
export async function DELETE(req: NextRequest, context) {
  const { params } = context;
  console.log("[API /properties/[id]] Incoming DELETE request", {
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    params,
  });
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
    console.log("[API /properties/[id]] User after verifyFirebaseIdToken:", user);
  } catch (err) {
    console.error("[API /properties/[id]] Error verifying token:", err);
  }
  if (!user) {
    console.warn("[API /properties/[id]] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const ref = adminDb.collection("properties").doc(params.id);
    await ref.delete();
    console.log("[API /properties/[id]] Deleted property:", params.id);
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

// OPTIONS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
