import { initTRPC } from '@trpc/server';
import type { User } from '../../types/user';
import type { DecodedIdToken } from 'firebase-admin/auth';
import superjson from 'superjson';

// Định nghĩa type cho context, cho phép user là User | DecodedIdToken | undefined
export type Context = {
  user?: User | DecodedIdToken;
};

// Khởi tạo tRPC instance với context type và transformer superjson
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Export các hàm cần thiết cho router
export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware kiểm tra đăng nhập cho protectedProcedure
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error('UNAUTHORIZED');
  }
  return next({ ctx });
});

// protectedProcedure: chỉ cho user đã đăng nhập (bạn cần chỉnh lại logic check context cho phù hợp dự án)
export const protectedProcedure = t.procedure.use(isAuthed);
