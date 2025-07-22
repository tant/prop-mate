import { NextRequest, NextResponse } from "next/server";
import { getClientById, updateClient, deleteClient } from "@/lib/clientService";
import { verifyFirebaseIdToken } from "@/lib/firebaseAdmin";

// GET /api/clients/[id]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /clients/[id]] Error verifying token:", err);
  }
  if (!user) {
    console.warn("[API /clients/[id]] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const client = await getClientById(id);
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(client);
  } catch (error) {
    console.error("[API /clients/[id]] GET error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/clients/[id]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /clients/[id]] Error verifying token:", err);
  }
  if (!user) {
    console.warn("[API /clients/[id]] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const client = await updateClient(id, data);
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(client);
  } catch (error) {
    console.error("[API /clients/[id]] PUT error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/clients/[id]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /clients/[id]] Error verifying token:", err);
  }
  if (!user) {
    console.warn("[API /clients/[id]] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await deleteClient(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /clients/[id]] DELETE error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// OPTIONS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
