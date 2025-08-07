import { initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";

// Đây là nơi bạn có thể định nghĩa context cho các procedure của mình.
// Ví dụ: lấy session người dùng, kết nối database.
// Hiện tại chúng ta sẽ để trống để đơn giản.
export const createTRPCContext = async (opts: {
  headers: Headers;
}) => {
  return {
    headers: opts.headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
