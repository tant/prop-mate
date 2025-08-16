// src/lib/product-page.ts
import { adminDb } from '@/lib/firebase/admin';
import { type ProductPage } from '@/types/product-page';
import { productPageSchema } from '@/types/product-page';

/**
 * Lấy trang sản phẩm theo slug (chỉ những trang đã xuất bản)
 * @param slug Slug của trang sản phẩm
 * @returns ProductPage nếu tìm thấy, null nếu không tìm thấy hoặc không công khai
 */
export async function getProductPageBySlug(slug: string): Promise<ProductPage | null> {
  try {
    // 1. Lấy document từ Firestore theo `slug` và `status` = 'published'
    const querySnapshot = await adminDb
      .collection('productPages')
      .where('slug', '==', slug)
      .where('status', '==', 'published')
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return null; // Không tìm thấy trang hoặc trang không công khai
    }

    const doc = querySnapshot.docs[0];
    const productPageData = doc.data();

    // 2. Chuyển đổi timestamp và tạo object ProductPage
    const productPage = {
      id: doc.id,
      ...productPageData,
      createdAt: productPageData?.createdAt?.toDate?.() ?? productPageData?.createdAt,
      updatedAt: productPageData?.updatedAt?.toDate?.() ?? productPageData?.updatedAt,
    };

    // 3. Validate với Zod schema
    const parsedProductPage = productPageSchema.safeParse(productPage);
    
    if (!parsedProductPage.success) {
      console.error("Lỗi khi validate dữ liệu trang sản phẩm:", parsedProductPage.error);
      return null;
    }

    return parsedProductPage.data;
  } catch (error) {
    console.error("Lỗi khi lấy trang sản phẩm theo slug:", error);
    return null;
  }
}