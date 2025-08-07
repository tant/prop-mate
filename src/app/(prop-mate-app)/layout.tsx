import type { Metadata } from "next";
import "@/app/globals.css";
import { redirect } from "next/navigation";
import { getServerUser } from "@/server/auth/getServerUser";
import { UserProvider } from "@/contexts/UserProvider";
import TRPCProvider from "@/app/_trpc/TRPCProvider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "PropMate - Trợ lý môi giới bất động sản",
  description:
    "Ứng dụng web giúp môi giới bất động sản quản lý khách hàng, BĐS, lịch hẹn, công việc hiệu quả, mọi lúc mọi nơi, ngay cả khi offline.",
  keywords:
    "quản lý bất động sản, môi giới, khách hàng, lịch hẹn, app môi giới, proptech, quản lý BĐS, offline, mobile-first, Việt Nam",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "PropMate",
    title: "PropMate - Trợ lý môi giới bất động sản",
    description:
      "Ứng dụng web giúp môi giới bất động sản quản lý khách hàng, BĐS, lịch hẹn, công việc hiệu quả, mọi lúc mọi nơi, ngay cả khi offline.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PropMate - Quản lý BĐS, khách hàng & lịch hẹn cho chuyên gia môi giới",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const firestoreUser = await getServerUser();
  if (!firestoreUser) {
    redirect("/login");
  }
  return (
    <UserProvider user={firestoreUser}>
      <TRPCProvider>{children}</TRPCProvider>
    </UserProvider>
  );
}