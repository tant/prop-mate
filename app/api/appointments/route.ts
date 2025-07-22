import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyFirebaseIdToken } from "@/lib/firebaseAdmin";
import { appointmentFromDoc, appointmentToFirestore, Appointment } from "@/models/appointment";

function setCORS(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

// GET /api/appointments - list all appointments
export async function GET(req: NextRequest) {
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /appointments] Error verifying token:", err);
  }
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const startAfterParam = searchParams.get("startAfter");
    let q = adminDb.collection("appointments").orderBy("time", "desc");
    if (limitParam) q = q.limit(Number(limitParam));
    if (startAfterParam) q = q.startAfter(Number(startAfterParam));
    const snapshot = await q.get();
    const appointments = snapshot.docs.map((doc) => appointmentFromDoc({ id: doc.id, ...doc.data() }));
    const res = NextResponse.json(appointments);
    return setCORS(res);
  } catch (error) {
    console.error("[API /appointments] GET error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const res = NextResponse.json({ error: message }, { status: 500 });
    return setCORS(res);
  }
}

// POST /api/appointments - create new appointment
export async function POST(req: NextRequest) {
  let user = null;
  try {
    user = await verifyFirebaseIdToken(req);
  } catch (err) {
    console.error("[API /appointments] Error verifying token:", err);
  }
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const now = new Date();
    const appointment: Omit<Appointment, "id"> = {
      ...data,
      status: "upcoming",
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await adminDb.collection("appointments").add(appointmentToFirestore(appointment));
    const res = NextResponse.json({ id: docRef.id, ...appointment });
    return setCORS(res);
  } catch (error) {
    console.error("[API /appointments] POST error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const res = NextResponse.json({ error: message }, { status: 500 });
    return setCORS(res);
  }
}

// OPTIONS preflight
export async function OPTIONS() {
  return setCORS(new NextResponse(null, { status: 204 }));
}
