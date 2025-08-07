import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../api/trpc';

// Khởi tạo tRPC React client cho TanStack Query
export const trpcReact = createTRPCReact<AppRouter>();
