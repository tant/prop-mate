"use client";


import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/app/_trpc/client";
import { PropertyForm, type PropertyCreateInput } from "@/components/page-properties/property-form";
import { PropertyProductPagesList } from "@/components/page-product/PropertyProductPagesList";
import { Button } from "@/components/ui/button";


export default function PropertyDetailPage() {

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = params?.id as string;
  const { data: property, isLoading, error, refetch } = api.property.getById.useQuery(propertyId, { enabled: !!propertyId });
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const updateProperty = api.property.update.useMutation();

  // Lấy trạng thái editMode và tab từ query param
  const editMode = useMemo(() => searchParams.get('editmode') === 'true', [searchParams]);
  const activeTab = useMemo(() => searchParams.get('tab') || 'details', [searchParams]);

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

  const setActiveTab = (value: string) => {
    const sp = new URLSearchParams(Array.from(searchParams.entries()));
    sp.set('tab', value);
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
    // TODO: Gửi dữ liệu để cập nhật property
    console.log("Dữ liệu submit:", data);
    alert("Dữ liệu đã được submit (cần implement API)");
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
      <div className="text-red-500 text-center">
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
            <div className="flex items-center gap-2 ml-auto">
              {!editMode && activeTab === 'details' && (
                <>
                  <Button
                    type="button"
                    className="bg-secondary text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors text-sm"
                    onClick={() => setEditMode(true)}
                  >
                    Sửa
                  </Button>
                  <Button
                    type="button"
                    className="bg-muted text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors text-sm"
                    onClick={() => window.history.back()}
                  >
                    Quay lại
                  </Button>
                </>
              )}
              {editMode && activeTab === 'details' && (
                <>
                  <Button
                    type="button"
                    className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 transition-colors text-sm"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                  <Button
                    type="button"
                    className="bg-muted text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors text-sm"
                    onClick={() => setEditMode(false)}
                    disabled={loading}
                  >
                    Hủy
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="details">Chi tiết</TabsTrigger>
              <TabsTrigger value="product-pages">Trang sản phẩm</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className={`transition-opacity duration-300 ${editMode ? 'opacity-100' : 'opacity-80'} animate-fade mt-4`}>
            {activeTab === 'details' && property && (
              <PropertyForm
                initialValues={property}
                formRef={formRef}
                loading={loading}
                disabled={!editMode}
                onSubmit={handleSubmit}
              />
            )}
            {activeTab === 'product-pages' && property && (
              <PropertyProductPagesList propertyId={property.id} />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
