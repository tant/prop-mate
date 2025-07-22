import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý BĐS - PropMate",
  description: "Quản lý, tìm kiếm, cập nhật thông tin bất động sản nhanh chóng, trực quan, hỗ trợ bản đồ, hình ảnh.",
  keywords: "quản lý bất động sản, BĐS, property management, proptech, Việt Nam, bản đồ, hình ảnh",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "PropMate",
    title: "Quản lý BĐS - PropMate",
    description: "Quản lý, tìm kiếm, cập nhật thông tin bất động sản nhanh chóng, trực quan, hỗ trợ bản đồ, hình ảnh.",
  },
};

export default async function PropertiesLayout({
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
