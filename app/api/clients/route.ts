import { NextRequest, NextResponse } from "next/server";
import { getAllClients, addClient } from "@/lib/clientService";
import { verifyFirebaseIdToken } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  // Optional: check auth
  const user = await verifyFirebaseIdToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clients = await getAllClients();
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const user = await verifyFirebaseIdToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  try {
    const client = await addClient(data);
    return NextResponse.json(client, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e instanceof Error ? e.message : String(e)) }, { status: 400 });
  }
}
