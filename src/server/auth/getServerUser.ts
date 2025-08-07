import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { appRouter } from "@/server/api/root";
import { createContextInner } from "@/server/api/trpc";

export async function getServerUser() {
  const cookieStore = await cookies();
  const idToken = cookieStore.get("token")?.value;
  if (!idToken) return null;
  try {
    const authUser = await adminAuth.verifyIdToken(idToken);
    const ctx = await createContextInner({ headers: new Headers(), user: authUser });
    const caller = appRouter.createCaller(ctx);
    return await caller.user.getById(authUser.uid);
  } catch {
    return null;
  }
}
