import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { adminDb } from '@/lib/firebase/admin';
import { PRODUCT_PAGE_TEMPLATES } from '@/constants/product-templates';
import { productPageSchema, productPageUpdateInputSchema } from '@/types/product-page';

export const productPageRouter = createTRPCRouter({
  // Lấy danh sách template
  getTemplates: protectedProcedure
    .input(z.void())
    .output(z.array(z.any()))
    .query(() => {
      return PRODUCT_PAGE_TEMPLATES;
    }),

  // Lấy danh sách tất cả các trang sản phẩm của user đang đăng nhập
  getByUser: protectedProcedure
    .input(z.void())
    .output(z.array(productPageSchema))
    .query(async ({ ctx }) => {
      const userId = ctx.user.uid;
      console.log('[getByUser] userId:', userId);
      try {
        const querySnapshot = await adminDb
          .collection('productPages')
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .get();
        console.log('[getByUser] Số lượng documents:', querySnapshot.size);
        const productPagesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('[getByUser] Document data:', data);
          return {
            id: doc.id,
            ...data,
            createdAt: data?.createdAt?.toDate?.() ?? data?.createdAt,
            updatedAt: data?.updatedAt?.toDate?.() ?? data?.updatedAt,
          };
        });
        const validProductPages = [];
        const errors = [];
        for (const pageData of productPagesData) {
          const result = productPageSchema.safeParse(pageData);
          if (result.success) {
            validProductPages.push(result.data);
          } else {
            console.error(`[getByUser] Lỗi khi parse trang sản phẩm ${pageData.id}:`, result.error);
            errors.push(result.error);
          }
        }
        console.log('[getByUser] Số lượng hợp lệ:', validProductPages.length);
        return validProductPages;
      } catch (err) {
        console.error('[getByUser] Firestore error:', err);
        throw err;
      }
    }),

  // Lấy thông tin chi tiết của một trang sản phẩm theo Slug (cho public page)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .output(productPageSchema)
    .query(async ({ input }) => {
      const querySnapshot = await adminDb
        .collection('productPages')
        .where('slug', '==', input.slug)
        .where('status', '==', 'published')
        .limit(1)
        .get();
      if (querySnapshot.empty) {
        throw new Error('Trang sản phẩm không tồn tại hoặc không công khai');
      }
      const doc = querySnapshot.docs[0];
      const productPageData = doc.data();
      const productPage = {
        id: doc.id,
        ...productPageData,
        createdAt: productPageData?.createdAt?.toDate?.() ?? productPageData?.createdAt,
        updatedAt: productPageData?.updatedAt?.toDate?.() ?? productPageData?.updatedAt,
      };
      return productPageSchema.parse(productPage);
    }),

  // Xóa một trang sản phẩm
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.uid;
      const docRef = adminDb.collection('productPages').doc(input.id);
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error('Trang sản phẩm không tồn tại');
      }
      const productPageData = doc.data();
      if (productPageData?.userId !== userId) {
        throw new Error('Bạn không có quyền xóa trang sản phẩm này');
      }
      await docRef.delete();
      return { success: true };
    }),

  // Cập nhật trang sản phẩm
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: productPageUpdateInputSchema,
    }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.uid;
      const docRef = adminDb.collection('productPages').doc(input.id);
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error('Trang sản phẩm không tồn tại');
      }
      const productPageData = doc.data();
      if (productPageData?.userId !== userId) {
        throw new Error('Bạn không có quyền cập nhật trang sản phẩm này');
      }
      const updateData = {
        ...input.data,
        updatedAt: new Date(),
      };
      await docRef.update(updateData);
      return { success: true };
    }),
});