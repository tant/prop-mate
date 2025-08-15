import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// TODO: Thay thế bằng dữ liệu thực tế từ API
const mockProductPages = [
  {
    id: '1',
    title: 'Căn hộ hiện đại cho gia đình trẻ',
    property: 'Căn hộ cao cấp The Metropole',
    status: 'published',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Đầu tư sinh lời với view sông',
    property: 'Penthouse Sky Villa',
    status: 'draft',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    title: 'Biệt thự sân vườn đẳng cấp',
    property: 'Biệt thự The Rivus',
    status: 'published',
    createdAt: '2024-03-10',
  },
];

export function ProductPagesList() {
  return (
    <div className="space-y-4">
      {mockProductPages.length === 0 ? (
        <div className="border rounded-lg p-4 text-center text-gray-500">
          Bạn chưa có bất động sản nào. <Link href="/properties/add" className="text-primary hover:underline">Tạo ngay</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProductPages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <CardTitle className="text-md">{page.title}</CardTitle>
                <CardDescription>{page.property}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    page.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/property-pages/${page.id}/edit`}>Chỉnh sửa</Link>
                  </Button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Tạo ngày: {page.createdAt}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}