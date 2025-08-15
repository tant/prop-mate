"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TemplateSelector } from "@/components/page-product/TemplateSelector"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { type ProductPageTemplate } from "@/constants/product-templates"

export default function AddProductPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<ProductPageTemplate | null>(null);
  const [audience, setAudience] = useState("");

  const handleSelectTemplate = (template: ProductPageTemplate) => {
    setSelectedTemplate(template);
  };

  const handleSubmit = () => {
    if (!selectedTemplate) {
      alert("Vui lòng chọn một template.");
      return;
    }
    if (!audience.trim()) {
      alert("Vui lòng nhập đối tượng khách hàng mục tiêu.");
      return;
    }
    
    // TODO: Gọi API để tạo trang sản phẩm
    console.log("Tạo trang với template:", selectedTemplate.id, "và audience:", audience);
    alert(`Sẽ tạo trang với template: ${selectedTemplate.name} và audience: ${audience}`);
    // Chuyển hướng sang trang edit sau khi tạo
    // router.push(`/property-pages/${newPageId}/edit`);
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Chọn Template & Nhập Audience</h2>
                <Button asChild variant="outline">
                  <Link href="/property-pages">Quay lại</Link>
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
                    <Button onClick={handleSubmit}>Tạo nhanh với AI</Button>
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