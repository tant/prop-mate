import type { Metadata } from "next";
import "@/app/globals.css";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { UserProvider } from "@/contexts/UserProvider";
import TRPCProvider from "@/app/_trpc/TRPCProvider";
import { appRouter } from "@/server/api/root";
import { createContextInner } from "@/server/api/trpc";

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
  const cookieStore = await cookies();
  const idToken = cookieStore.get("token")?.value;

  let authUser = null;
  let firestoreUser = null;
  if (idToken) {
    try {
      authUser = await adminAuth.verifyIdToken(idToken);
      // Tạo context cho tRPC caller
      const ctx = await createContextInner({ headers: new Headers(), user: authUser });
      const caller = appRouter.createCaller(ctx);
      firestoreUser = await caller.user.getById(authUser.uid);
    } catch {
      authUser = null;
      firestoreUser = null;
    }
  }

  if (!firestoreUser) {
    redirect("/login");
  }

  return (
    <UserProvider user={firestoreUser}>
      <TRPCProvider>{children}</TRPCProvider>
    </UserProvider>
  );
}