import { z } from 'zod';

// --- Zod Schemas cho Template ---

// Schema cho một field trong section
export const productPageTemplateFieldSchema = z.object({
  key: z.string(),
  type: z.enum(['string', 'text', 'image', 'array']), // Có thể mở rộng thêm các type khác
  itemType: z.string().optional(), // Nếu type là 'array', thì itemType xác định loại phần tử
  label: z.string(),
  required: z.boolean().optional().default(false),
});

// Schema cho một section trong template
export const productPageTemplateSectionSchema = z.object({
  id: z.string(),
  type: z.string(), // Loại section, ví dụ: 'hero', 'features', 'gallery'
  name: z.string(), // Tên hiển thị của section
  required: z.boolean().optional().default(false),
  fields: z.array(productPageTemplateFieldSchema),
});

// Schema cho một template
export const productPageTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  thumbnail: z.string(), // Đường dẫn đến ảnh thumbnail (sẽ nằm trong public/)
  sections: z.array(productPageTemplateSectionSchema),
});

// Type được tạo từ schema
export type ProductPageTemplateField = z.infer<typeof productPageTemplateFieldSchema>;
export type ProductPageTemplateSection = z.infer<typeof productPageTemplateSectionSchema>;
export type ProductPageTemplate = z.infer<typeof productPageTemplateSchema>;

// --- Các Template được định nghĩa cứng (Hardcoded) ---

// Template 1: Căn hộ hiện đại
export const modernApartmentTemplate: ProductPageTemplate = {
  id: 'modern-apartment-01',
  name: 'Căn hộ hiện đại',
  description: 'Template cho căn hộ hiện đại, phù hợp gia đình trẻ.',
  thumbnail: '/templates/modern-apartment-01.png', // Đường dẫn public
  sections: [
    {
      id: 'hero',
      type: 'hero',
      name: 'Hero Banner',
      required: true,
      fields: [
        { key: 'title', type: 'string', label: 'Tiêu đề chính', required: true },
        { key: 'subtitle', type: 'string', label: 'Mô tả ngắn' },
        { key: 'image', type: 'image', label: 'Ảnh nền' },
      ],
    },
    {
      id: 'features',
      type: 'features',
      name: 'Tiện ích nổi bật',
      fields: [
        { key: 'items', type: 'array', itemType: 'string', label: 'Danh sách tiện ích' },
      ],
    },
    {
      id: 'description',
      type: 'text',
      name: 'Mô tả chi tiết',
      fields: [
        { key: 'content', type: 'text', label: 'Nội dung mô tả', required: true },
      ],
    },
  ],
};

// Template 2: Dành cho nhà đầu tư
export const investorFocusedTemplate: ProductPageTemplate = {
  id: 'investor-focused-01',
  name: 'Dành cho nhà đầu tư',
  description: 'Template tập trung vào thông số tài chính và tiềm năng sinh lời.',
  thumbnail: '/templates/investor-focused-01.png', // Đường dẫn public
  sections: [
    {
      id: 'hero',
      type: 'hero',
      name: 'Hero Banner',
      required: true,
      fields: [
        { key: 'title', type: 'string', label: 'Tiêu đề chính', required: true },
        { key: 'subtitle', type: 'string', label: 'Mô tả ngắn' },
      ],
    },
    {
      id: 'financials',
      type: 'stats',
      name: 'Thông số tài chính',
      fields: [
        { key: 'price', type: 'string', label: 'Giá chào bán' },
        { key: 'pricePerSqm', type: 'string', label: 'Đơn giá / m²' },
        { key: 'projectedRoi', type: 'string', label: 'ROI dự kiến' },
      ],
    },
    {
      id: 'property-details',
      type: 'list',
      name: 'Thông số chính',
      fields: [
        { key: 'area', type: 'string', label: 'Diện tích' },
        { key: 'bedrooms', type: 'string', label: 'Phòng ngủ' },
        { key: 'legalStatus', type: 'string', label: 'Pháp lý' },
      ],
    },
  ],
};

// Mảng chứa tất cả các template
export const PRODUCT_PAGE_TEMPLATES: ProductPageTemplate[] = [
  modernApartmentTemplate,
  investorFocusedTemplate,
];

// Helper function để lấy template theo ID
export function getProductPageTemplateById(id: string): ProductPageTemplate | undefined {
  return PRODUCT_PAGE_TEMPLATES.find(template => template.id === id);
}