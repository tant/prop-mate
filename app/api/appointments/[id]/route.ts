import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyFirebaseIdToken } from "@/lib/firebaseAdmin";
import { appointmentFromDoc } from "@/models/appointment";

// Helper: Set CORS headers
function setCORS(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

// GET /api/appointments/[id] - Get appointment by id
export async function GET(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /appointments/[id]] Error verifying token:", err);
  }
  if (!user) {
    return setCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    const doc = await adminDb.collection("appointments").doc(id).get();
    if (!doc.exists) {
      return setCORS(NextResponse.json({ error: "Appointment not found" }, { status: 404 }));
    }
    const appointment = appointmentFromDoc({ id: doc.id, ...doc.data() });
    return setCORS(NextResponse.json(appointment));
  } catch (error) {
    console.error("[API /appointments/[id]] GET error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return setCORS(NextResponse.json({ error: message }, { status: 500 }));
  }
}

// PUT /api/appointments/[id] - Update appointment
export async function PUT(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /appointments/[id]] Error verifying token:", err);
  }
  if (!user) {
    return setCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    const data = await req.json();
    const now = new Date();
    const updateData = { ...data, updatedAt: now };
    await adminDb.collection("appointments").doc(id).update(updateData);
    return setCORS(NextResponse.json({ success: true }));
  } catch (error) {
    console.error("[API /appointments/[id]] PUT error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return setCORS(NextResponse.json({ error: message }, { status: 500 }));
  }
}

// DELETE /api/appointments/[id] - Cancel appointment (set status to 'cancelled')
export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params;
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /appointments/[id]] Error verifying token:", err);
  }
  if (!user) {
    return setCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    const now = new Date();
    await adminDb.collection("appointments").doc(id).update({ status: "cancelled", updatedAt: now });
    return setCORS(NextResponse.json({ success: true, cancelled: true }));
  } catch (error) {
    console.error("[API /appointments/[id]] DELETE (cancel) error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return setCORS(NextResponse.json({ error: message }, { status: 500 }));
  }
}

// OPTIONS /api/appointments/[id] - Preflight
export async function OPTIONS() {
  return setCORS(new NextResponse(null, { status: 204 }));
}
