import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// TODO: Thay thế bằng dữ liệu thực tế từ API
const mockProductPages = [
  {
    id: '1',
    title: 'Căn hộ hiện đại cho gia đình trẻ',
    status: 'published',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Đầu tư sinh lời với view sông',
    status: 'draft',
    createdAt: '2024-02-20',
  },
];

export function PropertyProductPagesList({ propertyId }: { propertyId: string }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Danh sách Trang Sản Phẩm</h3>
        <Button asChild>
          <Link href="/property-pages/add">Tạo Trang Mới</Link>
        </Button>
      </div>
      
      {mockProductPages.length === 0 ? (
        <div className="border rounded-lg p-4 text-center text-gray-500">
          Chưa có trang sản phẩm nào cho bất động sản này.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockProductPages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <CardTitle className="text-md">{page.title}</CardTitle>
                <CardDescription>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    page.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Tạo ngày: {page.createdAt}</span>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/property-pages/${page.id}/edit`}>Chỉnh sửa</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}