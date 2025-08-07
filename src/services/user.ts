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
  getById: (uid: string) => {
    console.log('[userApi.getById] uid:', uid);
    return trpcClient.user.getById.query(uid);
  },
  create: (data: User) => {
    console.log('[userApi.create] data:', data);
    // nó đã chạy vào đây
    return trpcClient.user.create.mutate(data);
  },
  update: (uid: string, data: Partial<User>) => {
    console.log('[userApi.update] uid:', uid, 'data:', data);
    return trpcClient.user.update.mutate({ uid, data });
  },
  softDelete: (uid: string) => {
    console.log('[userApi.softDelete] uid:', uid);
    return trpcClient.user.softDelete.mutate(uid);
  },
  list: () => {
    console.log('[userApi.list]');
    return trpcClient.user.list.query();
  },
};
