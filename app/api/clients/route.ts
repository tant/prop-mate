import { NextRequest, NextResponse } from "next/server";
import { getAllClients, addClient } from "@/lib/clientService";
import { verifyFirebaseIdToken } from "@/lib/firebaseAdmin";

// Helper: Set CORS headers
function setCORS(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

// GET /api/clients - List all clients
export async function GET(req: NextRequest) {
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /clients] Error verifying token:", err);
  }
  if (!user) {
    return setCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    const clients = await getAllClients();
    return setCORS(NextResponse.json(clients));
  } catch (error) {
    console.error("[API /clients] GET error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return setCORS(NextResponse.json({ error: message }, { status: 500 }));
  }
}

// POST /api/clients - Create new client
export async function POST(req: NextRequest) {
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /clients] Error verifying token:", err);
  }
  if (!user) {
    return setCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    const data = await req.json();
    const client = await addClient(data);
    return setCORS(NextResponse.json(client, { status: 201 }));
  } catch (error) {
    console.error("[API /clients] POST error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return setCORS(NextResponse.json({ error: message }, { status: 400 }));
  }
}

// OPTIONS /api/clients - Preflight
export async function OPTIONS() {
  return setCORS(new NextResponse(null, { status: 204 }));
}
