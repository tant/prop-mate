import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { api } from '@/app/_trpc/client';

export function PropertyProductPagesList({ propertyId }: { propertyId: string }) {
  // Đảm bảo không truyền null vào useQuery
  const { data: productPages, isLoading, isError, error } = api.productPage.getByUser.useQuery(undefined);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/products/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Đã copy link vào clipboard");
    }).catch(err => {
      console.error('Lỗi khi copy link: ', err);
      toast.error("Không thể copy link");
    });
  };

  // Lọc productPages theo propertyId
  const filteredPages = (productPages || []).filter(page => page.propertyId === propertyId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <h3 className="text-lg font-medium">Danh sách Trang Sản Phẩm</h3>
        <Button asChild size="sm">
          <Link href={`/property-pages/add?propertyId=${propertyId}`}>Tạo Trang Mới</Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : isError ? (
        <div className="text-center text-red-500">Lỗi: {error?.message}</div>
      ) : filteredPages.length === 0 ? (
        <div className="border rounded-lg p-4 text-center text-gray-500">
          Chưa có trang sản phẩm nào cho bất động sản này.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <CardTitle className="text-md">{page.title}</CardTitle>
                <CardDescription>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    page.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : page.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {page.status}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Tạo ngày: {page.createdAt && (new Date(page.createdAt).toLocaleDateString())}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleCopyLink(page.slug)}>
                      Copy Link
                    </Button>
                    <Link href={`/property-pages/${page.id}/edit`}>Chỉnh sửa</Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}