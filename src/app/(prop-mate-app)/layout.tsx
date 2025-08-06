import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ReactQueryProvider } from "@/lib/queryClient";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { UserContext } from "@/contexts/UserContext";
import { userService } from "@/server/user.server";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

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
  // Lấy cookie chứa Firebase ID token (ví dụ: "token" hoặc tên bạn lưu)
  const cookieStore = await cookies();
  const idToken = cookieStore.get("token")?.value;

  let user = null;
  if (idToken) {
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      user = await userService.getUserById(decoded.uid);
    } catch {
      user = null;
    }
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <html lang="vi">
      <body className={`${inter.variable} font-inter antialiased`}>
        <UserContext.Provider value={user}>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </UserContext.Provider>
      </body>
    </html>
  );
}