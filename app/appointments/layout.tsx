import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch hẹn & công việc - PropMate",
  description: "Tạo, quản lý, nhắc nhở lịch hẹn với khách hàng, xem lịch trình công việc mọi lúc, mọi nơi.",
  keywords: "lịch hẹn, công việc, appointment, schedule, nhắc nhở, môi giới, proptech, Việt Nam",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "PropMate",
    title: "Lịch hẹn & công việc - PropMate",
    description: "Tạo, quản lý, nhắc nhở lịch hẹn với khách hàng, xem lịch trình công việc mọi lúc, mọi nơi.",
  },
};

export default async function AppointmentsLayout({
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
