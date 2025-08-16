"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
// ...existing code...
import { useRouter, useSearchParams } from "next/navigation"
import { TemplateSelector } from "@/components/page-product/TemplateSelector"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { api } from "@/app/_trpc/client"
import type { ProductPageTemplate } from "@/constants/product-templates"


export default function AddProductPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<ProductPageTemplate | null>(null);
  const [audience, setAudience] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId');

  const handleSelectTemplate = (template: ProductPageTemplate) => {
    setSelectedTemplate(template);
  };

  const createProductPage = api.productPage.create.useMutation();

  const handleSubmit = async () => {
    if (!selectedTemplate) {
      alert("Vui lòng chọn một template.");
      return;
    }
    if (!audience.trim()) {
      alert("Vui lòng nhập đối tượng khách hàng mục tiêu.");
      return;
    }
    if (!propertyId) {
      alert("Thiếu propertyId, không thể tạo trang.");
      return;
    }
    try {
      const result = await createProductPage.mutateAsync({
        propertyId,
        templateId: selectedTemplate.id,
        audience,
        status: "draft",
        slug: "", // để backend tự sinh
        title: "", // placeholder
        usp: "", // placeholder
        content: {},
      });
      if (result?.id) {
        router.push(`/property-pages/${result.id}/edit`);
      } else {
        alert("Tạo trang thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      const message = (err instanceof Error) ? err.message : String(err);
  alert(`Lỗi khi tạo trang: ${message}`);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-lg font-semibold">Tạo Trang Sản Phẩm Mới</h1>
          </div>
        </header>
  <div className="flex flex-1 flex-col p-4 md:p-8">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Chọn Template & Nhập Audience</h2>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (propertyId) {
                      router.push(`/properties/${propertyId}`);
                    } else {
                      router.push('/property-pages');
                    }
                  }}
                >
                  Quay lại
                </Button>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">1. Chọn Template</h3>
                  <TemplateSelector 
                    onSelectTemplate={handleSelectTemplate} 
                    selectedTemplateId={selectedTemplate?.id} 
                  />
                </div>
                {selectedTemplate && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">2. Nhập Đối Tượng Khách Hàng Mục Tiêu</h3>
                    <div>
                      <Label htmlFor="audience">Audience (càng chi tiết càng tốt)</Label>
                      <Textarea
                        id="audience"
                        placeholder="Ví dụ: Gia đình trẻ có con nhỏ, tìm kiếm căn hộ hiện đại gần trung tâm..."
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleSubmit}>Tạo trang sản phẩm</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}