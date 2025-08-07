import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { adminAuth } from '@/lib/firebase/admin';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { cookies } from "next/headers";

interface CreateContextOptions {
  headers: Headers;
  user: DecodedIdToken | null;
}

export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    headers: opts.headers,
    user: opts.user,
  };
};

export const createContext = async (opts: { headers: Headers }) => {
  const { headers } = opts;
  let idToken: string | undefined;

  // Ưu tiên lấy từ Authorization header
  const authHeader = headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    idToken = authHeader.split('Bearer ')[1];
  }

  // Nếu không có, lấy từ cookie (Next.js App Router)
  if (!idToken) {
    try {
      const cookieStore = await cookies();
      idToken = cookieStore.get("token")?.value;
    } catch {}
  }

  if (idToken) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      return await createContextInner({ headers, user: decodedToken });
    } catch (error) {
      console.warn("Could not verify ID token:", error);
    }
  }
  return await createContextInner({ headers, user: null });
};

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.user.uid) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication required.' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);