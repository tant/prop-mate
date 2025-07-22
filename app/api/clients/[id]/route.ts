import { NextRequest, NextResponse } from "next/server";
import { getClientById, updateClient, deleteClient } from "@/lib/clientService";
import { verifyFirebaseIdToken } from "@/lib/firebaseAdmin";

// Helper: Set CORS headers
function setCORS(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

// GET /api/clients/[id] - Get client by id
export async function GET(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /clients/[id]] Error verifying token:", err);
  }
  if (!user) {
    return setCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    const client = await getClientById(id);
    if (!client) return setCORS(NextResponse.json({ error: "Not found" }, { status: 404 }));
    return setCORS(NextResponse.json(client));
  } catch (error) {
    console.error("[API /clients/[id]] GET error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return setCORS(NextResponse.json({ error: message }, { status: 500 }));
  }
}

// PUT /api/clients/[id] - Update client
export async function PUT(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /clients/[id]] Error verifying token:", err);
  }
  if (!user) {
    return setCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    const data = await req.json();
    const client = await updateClient(id, data);
    if (!client) return setCORS(NextResponse.json({ error: "Not found" }, { status: 404 }));
    return setCORS(NextResponse.json(client));
  } catch (error) {
    console.error("[API /clients/[id]] PUT error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return setCORS(NextResponse.json({ error: message }, { status: 500 }));
  }
}

// DELETE /api/clients/[id] - Delete client
export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /clients/[id]] Error verifying token:", err);
  }
  if (!user) {
    return setCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    await deleteClient(id);
    return setCORS(NextResponse.json({ success: true }));
  } catch (error) {
    console.error("[API /clients/[id]] DELETE error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return setCORS(NextResponse.json({ error: message }, { status: 500 }));
  }
}

// OPTIONS /api/clients/[id] - Preflight
export async function OPTIONS() {
  return setCORS(new NextResponse(null, { status: 204 }));
}
