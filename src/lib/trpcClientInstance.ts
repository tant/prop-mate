import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '@/api/trpc/routers/_app';

// tRPC client instance for direct (non-hook) calls (SSR/server)
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: typeof window === 'undefined' ? process.env.NEXT_PUBLIC_TRPC_URL || 'http://localhost:3000/api/trpc' : '/api/trpc',
      transformer: superjson,
    }),
  ],
});
