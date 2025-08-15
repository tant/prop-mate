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
import { useParams } from "next/navigation"

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  
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
            <h1 className="text-lg font-semibold">Chỉnh Sửa Trang Sản Phẩm</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">ID Trang: {params.id}</h2>
                <div className="space-x-2">
                  <Button asChild variant="outline">
                    <Link href="/property-pages">Quay lại</Link>
                  </Button>
                  <Button>Lưu</Button>
                </div>
              </div>
              {/* Nội dung chỉnh sửa chi tiết trang sản phẩm sẽ được thêm ở đây */}
              <div className="border rounded-lg p-4 text-center text-gray-500">
                Form chỉnh sửa chi tiết nội dung trang sản phẩm sẽ hiển thị ở đây.
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}