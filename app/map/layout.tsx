import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bản đồ BĐS - PropMate",
  description: "Xem vị trí, tra cứu bất động sản trên bản đồ trực quan, hỗ trợ tìm kiếm nhanh chóng.",
  keywords: "bản đồ, bất động sản, map, property, leaflet, OpenStreetMap, proptech, Việt Nam",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "PropMate",
    title: "Bản đồ BĐS - PropMate",
    description: "Xem vị trí, tra cứu bất động sản trên bản đồ trực quan, hỗ trợ tìm kiếm nhanh chóng.",
  },
};

export default async function MapLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
