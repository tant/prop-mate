import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { adminDb } from '@/lib/firebase/admin';
import { PRODUCT_PAGE_TEMPLATES, getProductPageTemplateById } from '@/constants/product-templates';
import { productPageSchema, productPageUpdateInputSchema, productPageCreateInputSchema } from '@/types/product-page';
import { callGeminiStructured } from '@/lib/gemini';

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

  // Lấy thông tin chi tiết của một trang sản phẩm theo ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .output(productPageSchema)
    .query(async ({ input }) => {
      console.log('[getById] input:', input);
      const docRef = adminDb.collection('productPages').doc(input.id);
      const doc = await docRef.get();
      if (!doc.exists) {
        console.warn(`[getById] Không tìm thấy trang sản phẩm với id: ${input.id}`);
        throw new Error('Trang sản phẩm không tồn tại');
      }
      const productPageData = doc.data();
      const productPage = {
        id: doc.id,
        ...productPageData,
        createdAt: productPageData?.createdAt?.toDate?.() ?? productPageData?.createdAt,
        updatedAt: productPageData?.updatedAt?.toDate?.() ?? productPageData?.updatedAt,
      };
      console.log('[getById] productPage:', productPage);
      return productPageSchema.parse(productPage);
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

  // Tạo mới một trang sản phẩm
  create: protectedProcedure
    .input(productPageCreateInputSchema)
    .output(productPageSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.uid;
      const now = new Date();

      // 1) Validate template tồn tại
      const template = getProductPageTemplateById(input.templateId);
      if (!template) {
        throw new Error('Template không tồn tại.');
      }

      // 2) Lấy thông tin property để làm ngữ cảnh cho AI
      const propertySnap = await adminDb.collection('properties').doc(input.propertyId).get();
      if (!propertySnap.exists) {
        throw new Error('Property không tồn tại.');
      }
      type MinimalPropertyContext = {
        propertyType?: string;
        listingType?: string;
        projectName?: string;
        location?: { fullAddress?: string; district?: string; city?: string };
        area?: number;
        bedrooms?: number;
        bathrooms?: number;
        price?: { value?: number; pricePerSqm?: number };
        interiorStatus?: string;
        legalStatus?: string;
        amenities?: string[] | string;
      };
      const property = propertySnap.data() as unknown as MinimalPropertyContext;

      // 3) Chuẩn bị prompt cho Gemini
      const systemPrompt = `Bạn là chuyên gia copywriting bất động sản cao cấp. Viết tiếng Việt tự nhiên, súc tích, thu hút, phù hợp đối tượng mục tiêu. \n\nYÊU CẦU QUAN TRỌNG:\n- Trả về CHỈ MỘT CHUỖI JSON HỢP LỆ với cấu trúc: { "title": string, "usp": string, "content": object }.\n- "content" là object có các key là ID của section trong template (ví dụ: "hero", "features"...), mỗi section chứa các field tương ứng theo mô tả template bên dưới.\n- Không thêm markdown, không giải thích, không ký hiệu \`\`\` json.\n- Không bịa URL hình ảnh. Nếu field có type "image", để chuỗi rỗng "" hoặc mô tả ngắn (không phải URL).`;

      const sectionDescriptions = template.sections.map((s) => {
        const fields = s.fields.map((f) => `- ${f.key}: ${f.type}${f.itemType ? `<${f.itemType}>` : ''}${f.required ? ' (required)' : ''}`).join('\n');
        return `Section ${s.id} (${s.name}) [type=${s.type}]\n${fields}`;
      }).join('\n\n');

      // Tóm tắt property cho prompt
      const summarize = (v: unknown) => (v === null || v === undefined ? '' : String(v));
      const userPrompt = `ĐỐI TƯỢNG MỤC TIÊU (audience):\n${input.audience}\n\nTHÔNG TIN BẤT ĐỘNG SẢN (property context):\n- Loại BĐS: ${summarize(property?.propertyType)}\n- Hình thức: ${summarize(property?.listingType)}\n- Dự án: ${summarize(property?.projectName)}\n- Địa chỉ: ${summarize(property?.location?.fullAddress)}\n- Khu vực: ${summarize(property?.location?.district)}, ${summarize(property?.location?.city)}\n- Diện tích: ${summarize(property?.area)} m²\n- Phòng ngủ / WC: ${summarize(property?.bedrooms)} / ${summarize(property?.bathrooms)}\n- Giá: ${summarize(property?.price?.value)} (đơn vị VNĐ)\n- Đơn giá/m²: ${summarize(property?.price?.pricePerSqm)}\n- Nội thất: ${summarize(property?.interiorStatus)}\n- Pháp lý: ${summarize(property?.legalStatus)}\n- Tiện ích: ${(Array.isArray(property?.amenities) ? property.amenities.join(', ') : summarize(property?.amenities))}\n\nTEMPLATE (sections & fields cần điền):\n${sectionDescriptions}\n\nNHIỆM VỤ:\n- Sinh "title" hấp dẫn, ngắn gọn (<= 80 ký tự), phù hợp audience.\n- Sinh "usp" (điểm bán hàng nổi bật) 1-2 câu.\n- Tạo "content" theo đúng các section và field của template. Tránh lặp từ, tập trung giá trị khác biệt của BĐS.\n- Chỉ trả về JSON hợp lệ như đã yêu cầu.`;

      // 4) Gọi Gemini để sinh dữ liệu có cấu trúc
      const apiKey = process.env.GEMINI_API_KEY || '';
      const aiOutputSchema = z.object({
        title: z.string().min(3),
        usp: z.string().min(5),
        content: z.record(z.string(), z.any()),
      });

      let generatedTitle = '';
      let generatedUsp = '';
      let generatedContent: Record<string, unknown> = {};

      try {
        const ai = await callGeminiStructured(systemPrompt, userPrompt, apiKey, aiOutputSchema);
        generatedTitle = ai.title;
        generatedUsp = ai.usp;
        generatedContent = ai.content as Record<string, unknown>;
      } catch (err) {
        // Theo kế hoạch giai đoạn 4: nếu AI lỗi, thông báo rõ ràng. Ở đây chọn throw để frontend hiển thị lỗi và cho phép thử lại.
        console.error('[productPage.create] AI generation failed:', err);
        throw new Error(err instanceof Error ? err.message : 'AI generation failed');
      }

      // 5) Sinh slug từ title hoặc audience (fallback)
      const slugSource = generatedTitle || input.audience || '';
      const slug = slugSource
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // 6) Lưu Firestore
      const docRef = await adminDb.collection('productPages').add({
        userId,
        propertyId: input.propertyId,
        templateId: input.templateId,
        audience: input.audience,
        slug,
        status: 'draft',
        title: generatedTitle,
        usp: generatedUsp,
        content: generatedContent,
        createdAt: now,
        updatedAt: now,
      });
      const doc = await docRef.get();
      const data = doc.data();
      return productPageSchema.parse({
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate?.() ?? data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.() ?? data?.updatedAt,
      });
    }),
});
