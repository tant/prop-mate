"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useMemo } from "react"
import { api } from "@/app/_trpc/client"
import dynamic from "next/dynamic"

// Dynamically import the Leaflet map to avoid SSR window errors
const LeafletMap = dynamic(() => import("@/components/page-map/LeafletMap"), { ssr: false })


export default function DashboardPage() {
  // Fetch all properties managed by current user (non-paginated for map)
  const propertiesQuery = api.property.getMyProperties.useQuery()

  type GeoPoint = { id: string; name?: string; lat: number; lng: number }
  type RawPoint = { id: string; name?: string; lat?: number; lng?: number }
  const points: GeoPoint[] = useMemo(() => {
    const mapped: RawPoint[] = (propertiesQuery.data ?? []).map((p) => ({
      id: p.id,
      name: p.memorableName,
      lat: p.location?.gps?.lat,
      lng: p.location?.gps?.lng,
    }))
    return mapped.filter((p): p is GeoPoint => typeof p.lat === "number" && typeof p.lng === "number")
  }, [propertiesQuery.data])
  
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
            <div className="flex flex-col flex-1 min-h-[80vh]">
              <section className="w-full h-[70vh] min-h-[420px] bg-muted rounded-md mb-2 overflow-hidden">
                {propertiesQuery.isLoading ? (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    Đang tải bản đồ...
                  </div>
                ) : propertiesQuery.isError ? (
                  <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-destructive">
                    <div>Đã xảy ra lỗi khi tải dữ liệu bất động sản.</div>
                    <button
                      type="button"
                      onClick={() => propertiesQuery.refetch()}
                      className="px-3 py-1 rounded-md bg-destructive text-destructive-foreground hover:opacity-90"
                    >
                      Thử lại
                    </button>
                  </div>
                ) : points.length === 0 ? (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    Chưa có bất động sản có tọa độ để hiển thị.
                  </div>
                ) : (
                  <LeafletMap points={points} />
                )}
              </section>
              <section className="w-full bg-white rounded-md overflow-auto flex items-center justify-center min-h-[200px]">
                {/* Section dưới: nội dung ở đây */}
                <h2 className="text-base font-bold">Thông tin chi tiết (TBD)</h2>
              </section>
            </div>
          </div>
        </div>
      </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
