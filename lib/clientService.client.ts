import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Client } from "@/models/client";

export async function fetchClients(): Promise<Client[]> {
  const q = query(collection(db, "clients"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Client));
}
