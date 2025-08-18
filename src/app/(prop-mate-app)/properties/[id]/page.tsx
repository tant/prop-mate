"use client";


import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
// ...existing code...
import { api } from "@/app/_trpc/client";
import { toast } from "sonner";
import { PropertyForm, type PropertyCreateInput } from "@/components/page-properties/property-form";
import { PropertyProductPagesList } from "@/components/page-product/PropertyProductPagesList";
import { Button } from "@/components/ui/button";
import { Pencil } from 'lucide-react';


export default function PropertyDetailPage() {
  // ...existing code...
  const updateProperty = api.property.update.useMutation({
    onSuccess: () => {
      toast.success("Cập nhật thành công!");
  // Chuyển về view mode bằng cách xóa query param editmode, giữ nguyên pathname
  const sp = new URLSearchParams(Array.from(searchParams.entries()));
  sp.delete('editmode');
  const query = sp.toString();
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  toast.success("Cập nhật thành công!");
  router.replace(url, { scroll: false });
  setTimeout(() => router.refresh(), 100);
    },
    onError: (err) => {
      toast.error(err.message || "Cập nhật thất bại");
    },
  });

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = params?.id as string;
  const { data: property, isLoading, error } = api.property.getById.useQuery(propertyId, { enabled: !!propertyId });
  const formRef = useRef<HTMLFormElement | null>(null);
  // ...existing code...
  // ...existing code...

  // Lấy trạng thái editMode và tab từ query param
  const editMode = useMemo(() => searchParams.get('editmode') === 'true', [searchParams]);
  const activeTab = useMemo(() => searchParams.get('tab') || 'details', [searchParams]);
  // State cho checkbox
  const [showProductPages, setShowProductPages] = useState(activeTab === 'product-pages');

  // Hàm chuyển đổi query param
  const setEditMode = (value: boolean) => {
    const sp = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      sp.set('editmode', 'true');
    } else {
      sp.delete('editmode');
    }
    const query = sp.toString();
    const url = query ? `?${query}` : '.';
    router.replace(url, { scroll: false });
  };

  // Khi đổi checkbox, cập nhật query param tab
  const handleToggleProductPages = (checked: boolean) => {
    setShowProductPages(checked);
    const sp = new URLSearchParams(Array.from(searchParams.entries()));
    if (checked) {
      sp.set('tab', 'product-pages');
    } else {
      sp.set('tab', 'details');
    }
    // Reset editMode khi chuyển tab
    sp.delete('editmode');
    const query = sp.toString();
    const url = query ? `?${query}` : '.';
    router.replace(url, { scroll: false });
  };

  const handleSave = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    } else {
      console.warn('formRef.current is null');
    }
  };

  const handleSubmit = (data: PropertyCreateInput) => {
    if (!propertyId) return;
    // Loại bỏ các field không cần thiết nếu muốn
    const cleaned = { ...data };
    updateProperty.mutate({ id: propertyId, data: cleaned });
  };

  if (isLoading) return (
    <div className="flex flex-1 flex-col p-4">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['a', 'b', 'c', 'd', 'e', 'f'].map((key) => (
            <div key={`skeleton-${key}`} className="border rounded-lg p-4 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  if (error) return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
  <div className="text-destructive text-center">
        <div className="text-xl font-semibold mb-2">Lỗi</div>
        <div className="mb-4">{error.message}</div>
  <Button onClick={() => router.refresh()}>Thử lại</Button>
      </div>
    </div>
  );
  if (!property) return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="text-gray-500 text-center">
        <div className="text-xl font-semibold mb-2">Không tìm thấy</div>
        <div className="mb-4">Không tìm thấy bất động sản này.</div>
  <Button onClick={() => router.push("/properties")}>Quay lại danh sách</Button>
      </div>
    </div>
  );

  // Nút Hủy: chỉ xóa query param editmode, giữ nguyên trang hiện tại
  const handleCancelEditMode = () => {
    const sp = new URLSearchParams(Array.from(searchParams.entries()));
    sp.delete('editmode');
    const query = sp.toString();
    const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    router.replace(url, { scroll: false });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-lg font-semibold">Thông tin bất động sản</h1>
            <div className="flex items-center ml-6">
              <Checkbox id="show-product-pages" checked={showProductPages} onCheckedChange={handleToggleProductPages} />
              <label htmlFor="show-product-pages" className="ml-2 select-none cursor-pointer text-sm">Xem các trang sản phẩm</label>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {!editMode && activeTab === 'details' && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setEditMode(true)}
                >
                  <Pencil className="w-4 h-4" />
                  Sửa
                </Button>
              )}
              {editMode && activeTab === 'details' && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleCancelEditMode}
                    disabled={isLoading}
                  >
                    Hủy
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4">
          <div className={`transition-opacity duration-300 ${editMode ? 'opacity-100' : 'opacity-80'} animate-fade mt-4`}>
            {!showProductPages && property && (
              <PropertyForm
                initialValues={property}
                formRef={formRef}
                loading={isLoading}
                disabled={!editMode}
                onSubmit={handleSubmit}
              />
            )}
            {showProductPages && property && (
              <PropertyProductPagesList propertyId={property.id} />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
