"use client";


import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/app/_trpc/client";
import { PropertyForm } from "@/components/page-properties/property-form";
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

  // Lấy trạng thái editMode từ query param
  const editMode = useMemo(() => searchParams.get('editmode') === 'true', [searchParams]);

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

  const handleSave = () => {
    console.log('handleSave called, formRef.current:', formRef.current);
    if (formRef.current) {
      formRef.current.requestSubmit();
    } else {
      console.warn('formRef.current is null');
    }
  };

  if (isLoading) return <div className="p-4">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-4 text-red-500">Lỗi: {error.message}</div>;
  if (!property) return <div className="p-4">Không tìm thấy bất động sản.</div>;

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
              {!editMode && (
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
              {editMode && (
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
        <div className={`flex flex-1 flex-col p-4 transition-opacity duration-300 ${editMode ? 'opacity-100' : 'opacity-80'} animate-fade`}>
          <PropertyForm
            initialValues={property}
            formRef={formRef}
            loading={loading}
            onSubmit={async (data) => {
              console.log('onSubmit called with data:', data);
              setLoading(true);
              try {
                await updateProperty.mutateAsync({ id: propertyId, data });
                toast.success("Cập nhật thành công!");
                if (editMode) setEditMode(false);
                refetch();
              } catch (err) {
                toast.error((err as Error)?.message || "Cập nhật thất bại");
              } finally {
                setLoading(false);
              }
            }}
            disabled={!editMode}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
