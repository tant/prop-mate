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
import { Search, Plus, Loader2, X } from "lucide-react"
import { useInView } from "react-intersection-observer"

const PAGE_SIZE = 20;
const DEBOUNCE_MS = 500; // Debounce delay for search; tuned for smoother UX and IME typing

export default function PropertiesPage() {
  const router = useRouter();
  const user = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isComposing, setIsComposing] = useState(false); // IME composition guard
  
  // Debounce search term
  useEffect(() => {
    if (isComposing) return; // don't debounce while composing IME input
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, DEBOUNCE_MS);
    
    return () => clearTimeout(timer);
  }, [searchTerm, isComposing]);
  
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
  
  // React Query automatically refetches when the query key changes (debouncedSearchTerm),
  // so we don't need a separate effect to reset pagination.
  
  // Load more when in view (stable deps)
  const { hasNextPage, isFetching, fetchNextPage } = propertiesQuery;
  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);
  
  // Flatten pages to a local display state to avoid flicker during search fetches
  const flattened = useMemo(() => propertiesQuery.data?.pages.flatMap(page => page.properties) ?? [], [propertiesQuery.data]);
  const [displayProperties, setDisplayProperties] = useState<typeof flattened>([]);
  useEffect(() => {
    setDisplayProperties(flattened);
  }, [flattened]);
  
  // Initial load only shows skeleton when there is no cached data
  const isLoadingInitial = propertiesQuery.isLoading && !propertiesQuery.data;
  
  // Check if we're fetching more data
  const isFetchingMore = propertiesQuery.isFetching && !!propertiesQuery.data;
  const isSearching = propertiesQuery.isFetching && !!propertiesQuery.data && debouncedSearchTerm !== undefined;
  
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
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      setSearchTerm("");
                    }
                  }}
                />
                {!!searchTerm && (
                  <button
                    type="button"
                    aria-label="Xóa tìm kiếm"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                {isSearching && (
                  <Loader2 className="absolute right-7 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-500" />
                )}
              </div>
              <Button
                size="sm"
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
              {Array.from({ length: 8 }).map(() => (
                <PropertyCardSkeleton key={crypto.randomUUID()} />
              ))}
            </div>
          )}
          {error && <div className="p-4 text-destructive">Lỗi: {error.message}</div>}
      {!isLoadingInitial && displayProperties.length === 0 && (
            <div className="p-4 text-muted-foreground">
              {debouncedSearchTerm 
                ? "Không tìm thấy bất động sản phù hợp." 
                : "Bạn chưa có bất động sản nào."}
            </div>
          )}
      {!isLoadingInitial && displayProperties.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {displayProperties.map((property: import("@/types/property").Property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
          highlightTerm={searchTerm}
                    onView={() => router.push(`/properties/${property.id}`)}
                    onEdit={() => router.push(`/properties/${property.id}?editmode=true`)}
                    onDelete={undefined} // tuỳ chỉnh nếu có chức năng xoá/lưu trữ
                  />
                ))}
              </div>
              <div className="flex justify-center py-4">
                {propertiesQuery.hasNextPage ? (
                  <div ref={ref} className="flex items-center gap-2">
                    {isFetchingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Đang tải thêm...</span>
                      </>
                    ) : (
                      <span>Cuộn xuống để tải thêm...</span>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground">Đã tải tất cả bất động sản</div>
                )}
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
