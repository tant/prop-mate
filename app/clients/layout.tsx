import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý khách hàng - PropMate",
  description: "Lưu trữ, tìm kiếm, quản lý thông tin khách hàng, lịch sử giao dịch, nhu cầu, liên hệ dễ dàng.",
  keywords: "quản lý khách hàng, CRM, môi giới, proptech, Việt Nam, khách hàng tiềm năng",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "PropMate",
    title: "Quản lý khách hàng - PropMate",
    description: "Lưu trữ, tìm kiếm, quản lý thông tin khách hàng, lịch sử giao dịch, nhu cầu, liên hệ dễ dàng.",
  },
};

export default async function ClientsLayout({
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
