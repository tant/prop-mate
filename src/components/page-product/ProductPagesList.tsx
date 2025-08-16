// ...existing code...
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { api } from '@/app/_trpc/client';
import { Trash2 } from 'lucide-react';

export function ProductPagesList() {
  // ...existing code...
  const { data: productPages, isLoading, isError, error } = api.productPage.getByUser.useQuery();
  const deleteProductPage = api.productPage.delete.useMutation();

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/products/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Đã copy link vào clipboard");
    }).catch(err => {
      console.error('Lỗi khi copy link: ', err);
      toast.error("Không thể copy link");
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa trang "${title}" không?`)) {
      return;
    }

    try {
      await deleteProductPage.mutateAsync({ id });
      toast.success("Trang đã được xóa");
      // Không cần gọi router.refresh() vì query sẽ tự động invalidated bởi tRPC
    } catch (err) {
      console.error('Lỗi khi xóa trang: ', err);
      toast.error("Không thể xóa trang");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Đang tải...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Lỗi khi tải danh sách trang: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {productPages && productPages.length === 0 ? (
        <div className="border rounded-lg p-4 text-center text-gray-500">
          Bạn chưa có trang sản phẩm nào. <Link href="/property-pages/add" className="text-primary hover:underline">Tạo ngay</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productPages?.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <CardTitle className="text-md">{page.title}</CardTitle>
                {/* <CardDescription>{page.property}</CardDescription> */}
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    page.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : page.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {page.status === 'published' ? 'Đã xuất bản' : page.status === 'draft' ? 'Bản nháp' : 'Không công khai'}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopyLink(page.slug)}
                  >
                    Copy link
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/property-pages/${page.id}/edit`}>Chỉnh sửa</Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(page.id, page.title)}
                      disabled={deleteProductPage.isPending}
                      aria-label="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-xs text-gray-500">
                    Tạo ngày: {new Date(page.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}