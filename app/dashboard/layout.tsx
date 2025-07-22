import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Dashboard - PropMate',
  description: 'Tổng quan hoạt động, hiệu suất, công việc môi giới bất động sản trên PropMate.',
  keywords: 'dashboard, tổng quan, báo cáo, hiệu suất, môi giới, proptech, Việt Nam',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'PropMate',
    title: 'Dashboard - PropMate',
    description: 'Tổng quan hoạt động, hiệu suất, công việc môi giới bất động sản trên PropMate.',
  },
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
   
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    
  );
}
