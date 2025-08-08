"use client";


import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/app/_trpc/client";
import { PropertyForm } from "@/components/page-properties/property-form";
import { Button } from "@/components/ui/button";


export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params?.id as string;
  const { data: property, isLoading, error, refetch } = api.property.getById.useQuery(propertyId, { enabled: !!propertyId });
  const [editMode, setEditMode] = useState(false);
  const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const updateProperty = api.property.update.useMutation();

  const handleSave = () => {
    if (formRef) {
      formRef.requestSubmit();
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
        <div className="flex flex-1 flex-col p-4">
          <PropertyForm
            initialValues={property}
            formRef={setFormRef}
            loading={loading}
            onSubmit={async (data) => {
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
            {...(!editMode && { disabled: true })}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
