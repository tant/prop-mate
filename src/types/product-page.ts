import { z } from 'zod';

// --- Zod Schemas cho ProductPage ---

// Schema cơ bản cho ProductPage (không bao gồm content)
export const productPageBaseSchema = z.object({
  id: z.string(),
  userId: z.string(), // ID của người dùng sở hữu trang sản phẩm này
  propertyId: z.string(),
  templateId: z.string(),
  slug: z.string(),
  status: z.enum(['draft', 'published', 'unlisted']),
  audience: z.string(), // input của user
  title: z.string(),    // do AI sinh ra
  usp: z.string(),      // do AI sinh ra
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema cho field `content`.
// Vì `content` phụ thuộc vào `templateId`, nên ban đầu ta định nghĩa một schema linh hoạt.
// Trong thực tế, khi lưu vào DB, `content` sẽ là một object với cấu trúc động.
// Khi load từ DB để edit, frontend có thể biết cấu trúc vì nó có `templateId`.
export const productPageContentSchema = z.record(z.string(), z.any());
// Hoặc có thể dùng z.unknown() nếu muốn linh hoạt hơn nữa.
// export const productPageContentSchema = z.unknown();

// Schema hoàn chỉnh cho ProductPage
export const productPageSchema = productPageBaseSchema.extend({
  content: productPageContentSchema,
});

// Schema cho tạo mới (bỏ id, createdAt, updatedAt, userId)
export const productPageCreateInputSchema = productPageBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  // status, slug, title, usp, content sẽ được gán sau khi AI xử lý
}).extend({
  content: productPageContentSchema.optional(), // content sẽ được gán sau
});

// Schema cho cập nhật (partial)
// Trong thực tế, khi cập nhật, có thể chỉ cập nhật một phần của `content`.
// Nhưng để đơn giản, ta có thể cập nhật toàn bộ `content` như một object.
export const productPageUpdateInputSchema = productPageSchema.partial();

// Type được tạo từ schema
export type ProductPageBase = z.infer<typeof productPageBaseSchema>;
export type ProductPageContent = z.infer<typeof productPageContentSchema>;
export type ProductPage = z.infer<typeof productPageSchema>;
export type ProductPageCreateInput = z.infer<typeof productPageCreateInputSchema>;
export type ProductPageUpdateInput = z.infer<typeof productPageUpdateInputSchema>;