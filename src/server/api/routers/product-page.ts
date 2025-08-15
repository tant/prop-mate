import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { adminDb } from '@/lib/firebase/admin';
import { generateProductPageContent } from '@/server/lib/services/product-page-ai-service';
import { PRODUCT_PAGE_TEMPLATES } from '@/constants/product-templates';
import { productPageCreateInputSchema, productPageSchema } from '@/types/product-page';
import slugify from 'slugify'; // Cần cài đặt: pnpm add slugify

// Helper function để tạo slug duy nhất
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = slugify(baseSlug, { lower: true, strict: true });
  let counter = 1;
  let isUnique = false;
  
  while (!isUnique) {
    const snapshot = await adminDb.collection('productPages').where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) {
      isUnique = true;
    } else {
      slug = `${slugify(baseSlug, { lower: true, strict: true })}-${counter}`;
      counter++;
    }
  }
  
  return slug;
}

export const productPageRouter = createTRPCRouter({
  // Lấy danh sách template
  getTemplates: protectedProcedure
    .input(z.void())
    .output(z.array(z.any())) // Có thể định nghĩa schema cụ thể cho template output nếu cần
    .query(() => {
      return PRODUCT_PAGE_TEMPLATES;
    }),

  // Tạo trang sản phẩm mới
  create: protectedProcedure
    .input(z.object({
      templateId: z.string(),
      audience: z.string().min(1, "Đối tượng khách hàng không được để trống"),
      propertyId: z.string(),
    }))
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id; // Lấy userId từ session (người dùng đã đăng nhập)
      
      // 1. Gọi AI service để tạo nội dung
      const { title, usp, content } = await generateProductPageContent(input.templateId, input.audience);
      
      // 2. Tạo slug từ title
      const baseSlug = title || `trang-san-pham-${Date.now()}`;
      const slug = await generateUniqueSlug(baseSlug);
      
      // 3. Tạo object dữ liệu ProductPage
      const newProductPageData: z.input<typeof productPageCreateInputSchema> = {
        userId,
        propertyId: input.propertyId,
        templateId: input.templateId,
        slug,
        status: 'draft',
        audience: input.audience,
        title,
        usp,
        content, // content đã được tạo bởi AI
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // 4. Lưu object vào collection 'productPages' trong Firestore
      const docRef = await adminDb.collection('productPages').add(newProductPageData);
      
      // 5. Trả về ID của document vừa tạo
      return { id: docRef.id };
    }),

  // Lấy thông tin chi tiết của một trang sản phẩm theo ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(productPageSchema) // Trả về schema của ProductPage
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id; // Lấy userId từ session
      
      // 1. Lấy document từ Firestore theo `id`
      const doc = await adminDb.collection('productPages').doc(input.id).get();
      
      if (!doc.exists) {
        throw new Error('Trang sản phẩm không tồn tại');
      }
      
      const productPageData = doc.data();
      
      // 2. Kiểm tra `userId` của document có khớp với `userId` từ context không (phân quyền)
      if (productPageData?.userId !== userId) {
        throw new Error('Bạn không có quyền truy cập trang sản phẩm này');
      }
      
      // 3. Trả về dữ liệu document
      // Cần đảm bảo dữ liệu từ Firestore khớp với schema Zod
      // Firestore timestamp cần được convert sang Date
      const productPage = {
        id: doc.id,
        ...productPageData,
        createdAt: productPageData?.createdAt?.toDate?.() ?? productPageData?.createdAt,
        updatedAt: productPageData?.updatedAt?.toDate?.() ?? productPageData?.updatedAt,
      };
      
      // Validate với Zod schema trước khi trả về
      return productPageSchema.parse(productPage);
    }),
});