"use client"


import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { PropertyCard } from "@/components/page-properties/property-card"
import { useCurrentUser } from "@/hooks/use-current-user"
import { api } from "@/app/_trpc/client"

export default function DashboardPage() {
  const router = useRouter();
  const user = useCurrentUser();
  const { data: properties, isLoading, error } = api.property.getMyProperties.useQuery(undefined, { enabled: !!user });

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
            <h1 className="text-lg font-semibold">Danh sách bất động sản</h1>
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="text"
                placeholder="Tìm kiếm bất động sản..."
                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 transition-colors text-sm"
                onClick={() => router.push("/properties/add")}
              >
                +
              </button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          {isLoading && <div className="p-4">Đang tải dữ liệu...</div>}
          {error && <div className="p-4 text-red-500">Lỗi: {error.message}</div>}
          {!isLoading && properties && properties.length === 0 && (
            <div className="p-4 text-gray-500">Bạn chưa có bất động sản nào.</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {properties?.map((property: import("@/types/property").Property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onView={() => router.push(`/properties/${property.id}`)}
                onEdit={() => router.push(`/properties/${property.id}/edit`)}
                onDelete={undefined} // tuỳ chỉnh nếu có chức năng xoá/lưu trữ
              />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
