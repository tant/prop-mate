import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PropMate - Trợ lý môi giới bất động sản",
  description:
    "Ứng dụng web giúp môi giới bất động sản quản lý khách hàng, BĐS, lịch hẹn, công việc hiệu quả, mọi lúc mọi nơi, ngay cả khi offline.",
  keywords:
    "quản lý bất động sản, môi giới, khách hàng, lịch hẹn, app môi giới, proptech, quản lý BĐS, offline, mobile-first, Việt Nam",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "PropMate",
    title: "PropMate - Trợ lý môi giới bất động sản",,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
