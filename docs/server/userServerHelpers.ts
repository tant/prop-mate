import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '../api/trpc/routers/_app';
import superjson from 'superjson';
import { adminAuth } from '@/lib/firebase/admin';
import type { User } from '@/types/user';
import type { DecodedIdToken } from 'firebase-admin/auth';

// Cho phép context user là User | DecodedIdToken | undefined
export type UserContext = User | DecodedIdToken | undefined;

// Hàm tạo helpers cho server component hoặc getServerSideProps
export async function createUserServerHelpers(idToken?: string) {
  let user: User | DecodedIdToken | undefined;
  if (idToken) {
    try {
      user = await adminAuth.verifyIdToken(idToken);
    } catch {
      user = undefined;
    }
  }

  return createServerSideHelpers({
    router: appRouter,
    ctx: { user }, // truyền context user nếu cần
    transformer: superjson,
  });
}
