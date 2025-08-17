"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"


export default function DashboardPage() {
  
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
            <h1 className="text-lg font-semibold">Bản đồ bất động sản đang quản lý</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 p-4">
            <div className="flex flex-col flex-1 h-[60vh] min-h-0">
              <section className="flex-1 max-h-[70%] w-full bg-gray-100 rounded-md mb-2 overflow-auto flex items-center justify-center">
                {/* Section trên: nội dung ở đây */}
                <h2 className="text-base font-bold">Section trên (tối đa 70%)</h2>
              </section>
              <section className="flex-1 w-full bg-white rounded-md overflow-auto flex items-center justify-center">
                {/* Section dưới: nội dung ở đây */}
                <h2 className="text-base font-bold">Section dưới</h2>
              </section>
            </div>
          </div>
        </div>
      </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
