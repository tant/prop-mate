import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Property } from "@/models/property";

const PROPERTIES_COLLECTION = "properties";

export async function fetchProperties(): Promise<Property[]> {
  const q = query(collection(db, PROPERTIES_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Property));
}
