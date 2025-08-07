import { createTRPCRouter } from './trpc';
import userRouter from './routers/user';
import propertyRouter from './routers/property';

export const appRouter = createTRPCRouter({
  user: userRouter,
  property: propertyRouter,
});

export type AppRouter = typeof appRouter;