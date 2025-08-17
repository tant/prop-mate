// ...existing code...
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  // Mutation xóa product page
  const deleteMutation = api.productPage.delete.useMutation({
    onSuccess: () => {
      toast.success('Đã xóa trang sản phẩm');
    },
    onError: (err) => {
  toast.error(`Lỗi khi xóa: ${err?.message || ''}`);
    },
  });

  // Lọc productPages theo propertyId
  const filteredPages = (productPages || []).filter(page => page.propertyId === propertyId);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa trang này?')) {
      await deleteMutation.mutateAsync({ id });
    }
  };

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
        <div className="text-center text-destructive">Lỗi: {error?.message}</div>
      ) : filteredPages.length === 0 ? (
        <div className="border rounded-lg p-4 text-center text-muted-foreground">
          Chưa có trang sản phẩm nào cho bất động sản này.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPages.map((page) => (
            <Card key={page.id} className="hover:shadow-lg transition">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-md truncate max-w-[70%]" title={page.title}>{page.title}</CardTitle>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    page.status === 'published' 
                      ? 'bg-success/10 text-success' 
                      : page.status === 'draft'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-muted text-foreground'
                  }`}>
                    {page.status}
                  </span>
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyLink(page.slug)}
                    disabled={page.status === 'draft'}
                    title={page.status === 'draft' ? 'Chỉ copy link khi đã xuất bản' : 'Copy link sản phẩm'}
                  >
                    Copy Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    Tạo ngày: {page.createdAt && (new Date(page.createdAt).toLocaleDateString())}
                  </span>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button asChild size="sm">
                    <Link href={`/property-pages/${page.id}/edit`}>Chỉnh sửa</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(page.id)}
                    disabled={deleteMutation.status === 'pending'}
                  >
                    Xóa
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