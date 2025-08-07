import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { userService } from '../../../server/user.server';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import type { User } from '../../../../src/types/user';

// Zod schema cho input
const userIdSchema = z.string().min(1, 'User ID is required');
const userCreateSchema = z.object({
  uid: z.string(),
  firstName: z.string(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email(),
  // Các trường optional khác có thể bổ sung nếu cần
});
const userUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  // Các trường optional khác có thể bổ sung nếu cần
});

export const userRouter = router({
  // Lấy thông tin user theo uid (chỉ cho user đã đăng nhập hoặc admin)
  getById: protectedProcedure.input(userIdSchema).query(async ({ input }) => {
    try {
      return await userService.getUserById(input);
    } catch (err) {
      if (err instanceof Error && err.message === 'Not found') throw new TRPCError({ code: 'NOT_FOUND' });
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err instanceof Error ? err.message : 'Unknown error' });
    }
  }),

  // Tạo mới user (public, ví dụ cho đăng ký)
  create: publicProcedure.input(userCreateSchema).mutation(async ({ input }) => {
    console.log('[tRPC user.create] input:', input);
    try {
      return await userService.createUser(input as User);
    } catch (err) {
      if (err instanceof Error && err.message === 'User already exists') throw new TRPCError({ code: 'CONFLICT', message: err.message });
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err instanceof Error ? err.message : 'Unknown error' });
    }
  }),

  // Cập nhật user (chỉ cho user đã đăng nhập hoặc admin)
  update: protectedProcedure.input(z.object({ uid: userIdSchema, data: userUpdateSchema })).mutation(async ({ input }) => {
    try {
      return await userService.updateUser(input.uid, input.data);
    } catch (err) {
      if (err instanceof Error && err.message === 'Not found') throw new TRPCError({ code: 'NOT_FOUND' });
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err instanceof Error ? err.message : 'Unknown error' });
    }
  }),

  // Xóa mềm user (chỉ cho user đã đăng nhập hoặc admin)
  softDelete: protectedProcedure.input(userIdSchema).mutation(async ({ input }) => {
    try {
      await userService.softDeleteUser(input);
      return { success: true };
    } catch (err) {
      if (err instanceof Error && err.message === 'Not found') throw new TRPCError({ code: 'NOT_FOUND' });
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err instanceof Error ? err.message : 'Unknown error' });
    }
  }),

  // Lấy danh sách user (chỉ cho admin, có thể bổ sung phân quyền)
  list: protectedProcedure.query(async () => {
    try {
      return await userService.listUsers();
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err instanceof Error ? err.message : 'Unknown error' });
    }
  }),
});
