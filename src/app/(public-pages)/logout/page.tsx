"use client";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/firebase/client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await signOut(auth);
        // Gọi API để xóa cookie đăng nhập
        await fetch("/api/logout", { method: "POST" });
      } catch (error) {
        // Ghi lại lỗi để debug, nhưng vẫn tiếp tục chuyển hướng
        console.error("Lỗi đăng xuất:", error);
      } finally {
        // Chuyển hướng sau một khoảng trễ ngắn để người dùng đọc được thông báo
        setTimeout(() => {
          router.replace("/");
        }, 1500);
      }
    };
    doLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Đang đăng xuất</CardTitle>
          <CardDescription>Vui lòng chờ trong giây lát...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 p-6 pt-0">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Bạn sẽ được tự động chuyển về trang chủ.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

