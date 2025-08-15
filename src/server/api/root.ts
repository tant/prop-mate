import { createTRPCRouter } from './trpc';
import userRouter from './routers/user';
import propertyRouter from './routers/property';
import { productPageRouter } from './routers/product-page';

export const appRouter = createTRPCRouter({
  user: userRouter,
  property: propertyRouter,
  productPage: productPageRouter,
});

export type AppRouter = typeof appRouter;