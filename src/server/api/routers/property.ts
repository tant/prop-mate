import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { propertyCreateSchema, propertyUpdateSchema } from "@/types/property.schema";
import type { Property } from "@/types/property";
import { adminDb, admin } from "@/lib/firebase/admin";
import { toDateSafe } from "@/lib/utils";

// FirestoreProperty type and convertPropertyDates utility (inlined for router-local use)
type FirestoreProperty = Partial<Omit<Property, 'id'>> & {
  notes?: Array<{ content: string; createdAt: Date | { toDate: () => Date }; createdBy: string }>;
  statusHistory?: Array<{ status: Property['status']; changedAt: Date | { toDate: () => Date }; changedBy: string }>;
};

/**
 * Converts Firestore property data to a Property object with JS Dates.
 * @param data Firestore property data (may have Firestore Timestamps)
 * @param docId Firestore document ID
 */
function convertPropertyDates(data: FirestoreProperty, docId: string): Property {
  return {
    ...data,
    id: docId,
    postedAt: data.postedAt ? toDateSafe(data.postedAt) : undefined,
    expiredAt: data.expiredAt ? toDateSafe(data.expiredAt) : undefined,
    createdAt: toDateSafe(data.createdAt),
    updatedAt: toDateSafe(data.updatedAt),
    handoverDate: data.handoverDate ? toDateSafe(data.handoverDate) : undefined,
    notes: Array.isArray(data.notes)
      ? data.notes.map((n) => ({ ...n, createdAt: toDateSafe(n.createdAt) }))
      : [],
    statusHistory: Array.isArray(data.statusHistory)
      ? data.statusHistory.map((s) => ({ ...s, changedAt: toDateSafe(s.changedAt) }))
      : [],
  } as Property;
}

const propertiesCollection = adminDb.collection("properties");

export const propertyRouter = createTRPCRouter({
  getAll: publicProcedure.query(async (): Promise<Property[]> => {
    const snapshot = await propertiesCollection.get();
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => convertPropertyDates(doc.data() as FirestoreProperty, doc.id));
  }),

  getById: publicProcedure
    .input(z.string().min(1, "Property ID cannot be empty."))
    .query(async ({ input: id }): Promise<Property> => {
      const doc = await propertiesCollection.doc(id).get();
      if (!doc.exists) throw new TRPCError({ code: "NOT_FOUND", message: `Property with ID '${id}' not found.` });
      return convertPropertyDates(doc.data() as FirestoreProperty, doc.id);
    }),

  create: protectedProcedure
    .input(propertyCreateSchema)
    .mutation(async ({ input }): Promise<Property> => {
      const now = admin.firestore.Timestamp.now();
      const docRef = await propertiesCollection.add({
        ...input,
        createdAt: now,
        updatedAt: now,
      });
      const doc = await docRef.get();
      return convertPropertyDates(doc.data() as FirestoreProperty, doc.id);
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string().min(1),
      data: propertyUpdateSchema,
    }))
    .mutation(async ({ input }): Promise<Property> => {
      const { id, data } = input;
      if (!data || Object.keys(data).length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No data to update" });
      }
      const docRef = propertiesCollection.doc(id);
      const now = admin.firestore.Timestamp.now();
      await docRef.update({ ...data, updatedAt: now });
      const updatedDoc = await docRef.get();
      return convertPropertyDates(updatedDoc.data() as FirestoreProperty, id);
    }),

  delete: protectedProcedure
    .input(z.string().min(1, "Property ID cannot be empty."))
    .mutation(async ({ input: id }): Promise<{ success: boolean }> => {
      await propertiesCollection.doc(id).delete();
      return { success: true };
    }),
});

export default propertyRouter;
