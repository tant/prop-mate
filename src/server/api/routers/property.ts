// Utility: deep remove all undefined fields from object
function deepRemoveUndefined<T>(obj: T): T {
  if (Array.isArray(obj)) return obj.map(deepRemoveUndefined) as T;
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, deepRemoveUndefined(v)])
    ) as T;
  }
  return obj;
}
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

  getMyProperties: protectedProcedure.query(async ({ ctx }): Promise<Property[]> => {
    const agentId = ctx.user?.uid;
    if (!agentId) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing agentId (user uid)" });
    }
    const snapshot = await propertiesCollection.where("agentId", "==", agentId).get();
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
    .mutation(async ({ input, ctx }): Promise<Property> => {
      const now = admin.firestore.Timestamp.now();
      const agentId = ctx.user?.uid;
      if (!agentId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing agentId (user uid)" });
      }
      const docRef = await propertiesCollection.add({
        ...input,
        agentId,
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
    .mutation(async ({ input, ctx }): Promise<Property> => {
      const { id, data } = input;
      console.log('[property.update] input:', input);
      console.log('[property.update] ctx.user:', ctx.user);
      if (!data || Object.keys(data).length === 0) {
        console.error('[property.update] No data to update');
        throw new TRPCError({ code: "BAD_REQUEST", message: "No data to update" });
      }
      const docRef = propertiesCollection.doc(id);
      const now = admin.firestore.Timestamp.now();
      // Deep remove undefined fields from data
      const cleanData = deepRemoveUndefined({ ...data, updatedAt: now });
      try {
        await docRef.update(cleanData);
      } catch (err) {
        console.error('[property.update] Firestore update error:', err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Firestore update failed", cause: err });
      }
      const updatedDoc = await docRef.get();
      if (!updatedDoc.exists) {
        console.error('[property.update] Updated doc not found:', id);
        throw new TRPCError({ code: "NOT_FOUND", message: `Property with ID '${id}' not found after update.` });
      }
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
