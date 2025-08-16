import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductPageRenderer } from '@/components/page-product/ProductPageRenderer';
import { type ProductPage } from '@/types/product-page';
import { getProductPageBySlug } from '@/lib/product-page';

// Cấu hình ISR: Regenerate page mỗi 1 giờ
export const revalidate = 3600;

// Props cho page component
interface PageProps {
  params: Promise<{ slug: string }>;
}

// Hàm để tạo metadata cho SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Fetch dữ liệu để tạo metadata
  // Lưu ý: Không nên fetch dữ liệu 2 lần. Có thể cache kết quả fetch.
  // Trong thực tế, có thể dùng React cache hoặc lưu vào context.
  const productPage = await getProductPageBySlug(slug);

  if (!productPage) {
    return {
      title: 'Trang không tìm thấy',
    };
  }

  const title = productPage.title;
  const description = productPage.usp || `Trang sản phẩm: ${title}`;
  const url = `https://yourdomain.com/products/${productPage.slug}`; // Thay bằng domain thực tế

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'PropMate',
      // images: [ // TODO: Thêm OG image
      //   {
      //     url: productPage.content.hero?.image || '/default-og-image.jpg',
      //     width: 1200,
      //     height: 630,
      //     alt: title,
      //   },
      // ],
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      // images: [productPage.content.hero?.image || '/default-og-image.jpg'], // TODO: Thêm OG image
    },
  };
}

export default async function PublicProductPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch dữ liệu server-side bằng hàm tiện ích
  const productPage = await getProductPageBySlug(slug);

  // Nếu không tìm thấy trang, trả về trang 404
  if (!productPage) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">PropMate</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/" className="hover:underline">Trang chủ</Link></li>
              <li><Link href="/properties" className="hover:underline">Bất động sản</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{productPage.title}</h1>
        <p className="text-muted-foreground mb-6">{productPage.usp}</p>
        
        {/* Sử dụng ProductPageRenderer để render nội dung */}
        <ProductPageRenderer productPage={productPage} />
      </main>

      <footer className="border-t mt-8 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} PropMate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}