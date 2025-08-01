import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Appointment } from "@/models/appointment";

const COLLECTION = "appointments";

export async function fetchAppointments(): Promise<Appointment[]> {
  const q = query(collection(db, COLLECTION), orderBy("time", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Appointment));
}
