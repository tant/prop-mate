import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import type { User } from "@/types/user";
import { adminDb, admin } from "@/lib/firebase/admin";

const usersCollection = adminDb.collection("users");

type FirestoreDateLike = Date | { toDate: () => Date } | undefined | null;
function toDateSafe(val: FirestoreDateLike): Date {
  if (!val) return new Date(0);
  if (val instanceof Date) return val;
  if (typeof val === 'object' && typeof val.toDate === 'function') return val.toDate();
  return new Date(0);
}

type FirestoreUser = Partial<Omit<User, 'uid'>>;

function convertUserDates(data: FirestoreUser, docId: string): User {
  return {
    uid: docId,
    firstName: data.firstName ?? '',
    email: data.email ?? '',
    lastName: data.lastName,
    phoneNumber: data.phoneNumber,
    emailVerified: data.emailVerified,
    phoneVerified: data.phoneVerified,
    address: data.address,
    profileImage: data.profileImage,
    deletedAt: data.deletedAt ? toDateSafe(data.deletedAt) : undefined,
    referralCode: data.referralCode,
    referredBy: data.referredBy,
    deviceTokens: data.deviceTokens,
    subscription: data.subscription
      ? {
          ...data.subscription,
          startDate: toDateSafe(data.subscription.startDate),
          endDate: toDateSafe(data.subscription.endDate),
          lastPayment: data.subscription.lastPayment
            ? {
                ...data.subscription.lastPayment,
                paidAt: toDateSafe(data.subscription.lastPayment.paidAt),
              }
            : undefined,
        }
      : undefined,
    settings: data.settings,
    onboarding: data.onboarding,
    notes: data.notes,
    createdAt: toDateSafe(data.createdAt),
    updatedAt: toDateSafe(data.updatedAt),
    lastLoginAt: data.lastLoginAt ? toDateSafe(data.lastLoginAt) : undefined,
  };
}

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async (): Promise<User[]> => {
    try {
      const snapshot = await usersCollection.get();
      if (snapshot.empty) return [];
      return snapshot.docs.map((doc) => convertUserDates(doc.data() as FirestoreUser, doc.id));
    } catch (error) {
      console.error("tRPC user.getAll error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch users from database.",
      });
    }
  }),

  getById: publicProcedure
    .input(z.string().min(1, "User ID cannot be empty."))
    .query(async ({ input: uid }): Promise<User> => {
      try {
        const doc = await usersCollection.doc(uid).get();
        if (!doc.exists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `User with ID '${uid}' not found.`,
          });
        }
        return convertUserDates(doc.data() as FirestoreUser, doc.id);
      } catch (error) {
        console.error(`tRPC user.getById error for ID ${uid}:`, error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user.",
        });
      }
    }),

  create: publicProcedure
    .input(
      z.object({
        uid: z.string().min(1, "UID is required from Firebase Auth"),
        email: z.string().email("Invalid email format."),
        firstName: z.string().min(1, "First name is required."),
        lastName: z.string().optional(),
        phoneNumber: z.string().optional(),
      })
    )
    .mutation(async ({ input }): Promise<User> => {
      const { uid, ...userData } = input;
      const now = admin.firestore.Timestamp.now();
      try {
        const userRecord = {
          ...userData,
          createdAt: now,
          updatedAt: now,
        };
        await usersCollection.doc(uid).set(userRecord);
        return convertUserDates(userRecord as unknown as FirestoreUser, uid);
      } catch (error) {
        console.error(`tRPC user.create error for UID ${uid}:`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user record in database.",
        });
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        uid: z.string().min(1),
        data: z
          .object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            phoneNumber: z.string().optional(),
          })
          .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided to update.",
          }),
      })
    )
    .mutation(async ({ input }): Promise<User> => {
      const { uid, data } = input;
      try {
        const userRef = usersCollection.doc(uid);
        const now = admin.firestore.Timestamp.now();
        await userRef.update({ ...data, updatedAt: now });
        const updatedDoc = await userRef.get();
        return convertUserDates(updatedDoc.data() as FirestoreUser, uid);
      } catch (error) {
        console.error(`tRPC user.update error for UID ${uid}:`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update user.",
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string().min(1, "User ID cannot be empty."))
    .mutation(async ({ input: uid }): Promise<{ success: boolean }> => {
      try {
        await usersCollection.doc(uid).delete();
        return { success: true };
      } catch (error) {
        console.error(`tRPC user.delete error for UID ${uid}:`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete user.",
        });
      }
    }),
});