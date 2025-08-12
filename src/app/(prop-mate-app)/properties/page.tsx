"use client"

import { useState, useEffect, useMemo } from "react";
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { PropertyCard } from "@/components/page-properties/property-card"
import { PropertyCardSkeleton } from "@/components/page-properties/property-card-skeleton"
import { useCurrentUser } from "@/hooks/use-current-user"
import { api } from "@/app/_trpc/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, Loader2 } from "lucide-react"
import { useInView } from "react-intersection-observer"

const PAGE_SIZE = 20;

export default function DashboardPage() {
  const router = useRouter();
  const user = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  const propertiesQuery = api.property.getMyPropertiesPaginated.useInfiniteQuery(
    {
      limit: PAGE_SIZE,
      searchTerm: debouncedSearchTerm || undefined,
    },
    {
      enabled: !!user,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  
  const { ref, inView } = useInView();
  
  // Reset pagination when search term changes
  useEffect(() => {
    propertiesQuery.refetch();
  }, [debouncedSearchTerm, propertiesQuery]);
  
  // Load more when in view
  useEffect(() => {
    if (inView && propertiesQuery.hasNextPage && !propertiesQuery.isFetching) {
      propertiesQuery.fetchNextPage();
    }
  }, [inView, propertiesQuery]);
  
  // Flatten pages into a single array
  const allProperties = useMemo(() => {
    return propertiesQuery.data?.pages.flatMap(page => page.properties) ?? [];
  }, [propertiesQuery.data]);
  
  // Check if we're still loading initial data
  const isLoadingInitial = propertiesQuery.isLoading;
  
  // Check if we're fetching more data
  const isFetchingMore = propertiesQuery.isFetching && propertiesQuery.data;
  
  // Check if there's an error
  const error = propertiesQuery.error;

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
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm bất động sản..."
                  className="pl-8 pr-4 py-1 text-sm w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                size="sm"
                className="bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                onClick={() => router.push("/properties/add")}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          {isLoadingInitial && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <PropertyCardSkeleton key={index} />
              ))}
            </div>
          )}
          {error && <div className="p-4 text-red-500">Lỗi: {error.message}</div>}
          {!isLoadingInitial && allProperties.length === 0 && (
            <div className="p-4 text-gray-500">
              {debouncedSearchTerm 
                ? "Không tìm thấy bất động sản phù hợp." 
                : "Bạn chưa có bất động sản nào."}
            </div>
          )}
          {!isLoadingInitial && allProperties.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                {allProperties.map((property: import("@/types/property").Property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onView={() => router.push(`/properties/${property.id}`)}
                    onEdit={() => router.push(`/properties/${property.id}`)} // We'll handle edit mode in the detail page
                    onDelete={undefined} // tuỳ chỉnh nếu có chức năng xoá/lưu trữ
                  />
                ))}
              </div>
              <div className="flex justify-center py-4">
                {propertiesQuery.hasNextPage && (
                  <div ref={ref} className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang tải thêm...</span>
                  </div>
                )}
                {isFetchingMore && !propertiesQuery.hasNextPage && (
                  <div>Đã tải tất cả bất động sản</div>
                )}
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
