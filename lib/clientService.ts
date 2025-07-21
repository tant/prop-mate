import { adminDb } from "@/lib/firebaseAdmin";
import { Client } from "@/models/client";
import { Timestamp } from "firebase-admin/firestore";

const COLLECTION = "clients";

export async function getAllClients(): Promise<Client[]> {
  const snapshot = await adminDb.collection(COLLECTION).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Client));
}

export async function getClientById(id: string): Promise<Client | null> {
  const doc = await adminDb.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Client;
}

export async function addClient(data: Omit<Client, "id" | "createdAt" | "updatedAt">): Promise<Client> {
  const now = Timestamp.now();
  const docRef = await adminDb.collection(COLLECTION).add({ ...data, createdAt: now, updatedAt: now });
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() } as Client;
}

export async function updateClient(id: string, data: Partial<Client>): Promise<Client | null> {
  const now = Timestamp.now();
  await adminDb.collection(COLLECTION).doc(id).update({ ...data, updatedAt: now });
  return getClientById(id);
}

export async function deleteClient(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).delete();
}
