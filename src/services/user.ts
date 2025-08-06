import { trpcReact } from '@/lib/trpcClient';
import { trpcClient } from '@/lib/trpcClientInstance';
import type { User } from '@/types/user';

// React hooks for use in components
export const userHooks = {
  useGetById: trpcReact.user.getById.useQuery,
  useCreate: trpcReact.user.create.useMutation,
  useUpdate: trpcReact.user.update.useMutation,
  useSoftDelete: trpcReact.user.softDelete.useMutation,
  useList: trpcReact.user.list.useQuery,
};

// Direct-call API for SSR/server logic
export const userApi = {
  getById: (uid: string) => trpcClient.user.getById.query(uid),
  create: (data: User) => trpcClient.user.create.mutate(data),
  update: (uid: string, data: Partial<User>) => trpcClient.user.update.mutate({ uid, data }),
  softDelete: (uid: string) => trpcClient.user.softDelete.mutate(uid),
  list: () => trpcClient.user.list.query(),
};
