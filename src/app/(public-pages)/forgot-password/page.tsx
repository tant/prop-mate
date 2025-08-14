"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { usePasswordReset } from "@/hooks/use-password-reset";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  
  const { resetPassword, loading, success, error } = usePasswordReset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetPassword(email);
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Quên mật khẩu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <p className="text-green-600">
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
                </p>
                <p className="text-sm text-muted-foreground">
                  Vui lòng kiểm tra hộp thư đến (và cả thư rác) để tiếp tục.
                </p>
                <Button 
                  onClick={() => router.push("/login")} 
                  className="w-full"
                >
                  Quay lại đăng nhập
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mail@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                {error && (
                  <div className="text-destructive text-sm">{error}</div>
                )}
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Đang gửi..." : "Gửi yêu cầu đặt lại mật khẩu"}
                </Button>
                
                <div className="text-center text-sm">
                  <Link 
                    href="/login" 
                    className="text-primary hover:underline"
                  >
                    Quay lại đăng nhập
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
        
        <div className="text-muted-foreground text-center text-xs mt-4">
          Khi tiếp tục, bạn đồng ý với{" "}
          <Link href="/terms-and-conditions" className="underline underline-offset-4">
            Điều khoản dịch vụ
          </Link>{" "}
          và{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            Chính sách bảo mật
          </Link>{" "}
          của chúng tôi.
        </div>
      </div>
    </div>
  );
}