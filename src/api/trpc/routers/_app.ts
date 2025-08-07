import { router } from '../trpc';
import { userRouter } from './user';

export const appRouter = router({
  user: userRouter,
  // Thêm các router khác ở đây nếu có
});

export type AppRouter = typeof appRouter;

// Đã hợp nhất vào src/api/trpc/index.ts. File này không còn cần thiết.
