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
import { ProductPagesList } from "@/components/page-product/ProductPagesList"

export default function ProductPagesDashboardPage() {
  
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
            <h1 className="text-lg font-semibold">Các trang sản phẩm của bạn</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Danh sách Trang Sản Phẩm</h2>
                <Button asChild>
                  <Link href="/property-pages/add">Thêm Trang</Link>
                </Button>
              </div>
              {/* Nội dung danh sách trang sản phẩm */}
              <ProductPagesList />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
