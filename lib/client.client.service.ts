import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Client } from "@/models/client";

const CLIENTS_COLLECTION = "clients";

export async function fetchClients(): Promise<Client[]> {
  const q = query(collection(db, CLIENTS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Client));
}
