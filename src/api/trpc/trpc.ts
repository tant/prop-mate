import { initTRPC } from '@trpc/server';

// Khởi tạo tRPC instance
const t = initTRPC.create();

// Export các hàm cần thiết cho router
export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware kiểm tra đăng nhập cho protectedProcedure
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx?.user) {
    throw new Error('UNAUTHORIZED');
  }
  return next({ ctx });
});

// protectedProcedure: chỉ cho user đã đăng nhập (bạn cần chỉnh lại logic check context cho phù hợp dự án)
export const protectedProcedure = t.procedure.use(isAuthed);
