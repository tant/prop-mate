"use client"

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { userApi } from "../../docs/services/user";

const passwordRequirements = [
  "Tối thiểu 8 ký tự",
  "Có chữ hoa (A-Z)",
  "Có chữ thường (a-z)",
  "Có số (0-9)",
  "Có ký tự đặc biệt (!@#$...)"
];

const registerSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string()
    .min(8, "Tối thiểu 8 ký tự")
    .regex(/[A-Z]/, "Phải có chữ hoa (A-Z)")
    .regex(/[a-z]/, "Phải có chữ thường (a-z)")
    .regex(/[0-9]/, "Phải có số (0-9)")
    .regex(/[^A-Za-z0-9]/, "Phải có ký tự đặc biệt (!@#$...)")
    .max(64, "Tối đa 64 ký tự"),
  confirmPassword: z.string(),
  firstName: z.string().min(1, "Vui lòng nhập họ"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const passwordValue = useWatch({ control, name: "password" });

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(passwordValue ?? "");

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setServerError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const idToken = await result.user.getIdToken();
      // Gọi API tạo user Firestore
      await userApi.create({
        uid: result.user.uid,
        email: data.email,
        firstName: data.firstName,
        emailVerified: result.user.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      // Tới đây là không chạy được

      await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error?.code === "auth/email-already-in-use") {
        setServerError("Email này đã được đăng ký. Vui lòng dùng email khác.");
      } else if (error?.code === "auth/invalid-email") {
        setServerError("Email không hợp lệ.");
      } else if (error?.code === "auth/weak-password") {
        setServerError("Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.");
      } else {
        setServerError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center flex-col gap-6")}> 
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Tạo tài khoản mới</h1>
                <p className="text-muted-foreground text-balance">
                  Đăng ký tài khoản PropMate để sử dụng đầy đủ tính năng
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  {...register("email")}
                  disabled={loading}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                />
                {errors.email && (
                  <span id="email-error" className="text-destructive text-xs mt-1">{errors.email.message}</span>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password")}
                  disabled={loading}
                  aria-invalid={!!errors.password}
                  aria-describedby="password-help password-error"
                />
                {/* Progress bar for password strength */}
                <div className="h-2 w-full bg-muted rounded mt-2 overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all",
                      passwordStrength === 0 ? "bg-gray-200 w-0" :
                      passwordStrength === 1 ? "bg-red-500 w-1/5" :
                      passwordStrength === 2 ? "bg-orange-400 w-2/5" :
                      passwordStrength === 3 ? "bg-yellow-400 w-3/5" :
                      passwordStrength === 4 ? "bg-blue-500 w-4/5" :
                      passwordStrength === 5 ? "bg-green-600 w-full" :
                      ""
                    )}
                  />
                </div>
                <div className="text-xs mt-1">
                  {passwordStrength === 0 ? "Chưa nhập mật khẩu" :
                   passwordStrength <= 2 ? "Yếu" :
                   passwordStrength === 3 ? "Trung bình" :
                   passwordStrength === 4 ? "Khá" :
                   passwordStrength === 5 ? "Mạnh" : ""}
                </div>
                <div id="password-help" className="text-xs text-muted-foreground mt-1">
                  Mật khẩu phải đáp ứng:
                  <ul className="list-disc ml-5">
                    {passwordRequirements.map((req, i) => (
                      <li key={req} className={
                        i === 0 && (passwordValue?.length ?? 0) >= 8 ? "text-green-600" :
                        i === 1 && /[A-Z]/.test(passwordValue ?? "") ? "text-green-600" :
                        i === 2 && /[a-z]/.test(passwordValue ?? "") ? "text-green-600" :
                        i === 3 && /[0-9]/.test(passwordValue ?? "") ? "text-green-600" :
                        i === 4 && /[^A-Za-z0-9]/.test(passwordValue ?? "") ? "text-green-600" :
                        ""
                      }>{req}</li>
                    ))}
                  </ul>
                </div>
                {errors.password && (
                  <span id="password-error" className="text-destructive text-xs mt-1">{errors.password.message}</span>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  disabled={loading}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby="confirmPassword-error"
                />
                {errors.confirmPassword && (
                  <span id="confirmPassword-error" className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</span>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="firstName">Tên</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Nhập tên của bạn"
                  {...register("firstName")}
                  disabled={loading}
                  aria-invalid={!!errors.firstName}
                  aria-describedby="firstName-error"
                />
                {errors.firstName && (
                  <span id="firstName-error" className="text-destructive text-xs mt-1">{errors.firstName.message}</span>
                )}
              </div>
              {serverError && (
                <div className="text-destructive text-sm text-center">{serverError}</div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Hoặc tiếp tục với
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button" className="w-full" disabled>
                  {/* Apple icon */}
                  <span>Apple</span>
                </Button>
                <Button variant="outline" type="button" className="w-full" onClick={() => alert('Chức năng đăng ký với Google chưa được cấu hình!')}>
                  {/* Google icon */}
                  <span>Google</span>
                </Button>
                <Button variant="outline" type="button" className="w-full" disabled>
                  {/* Meta icon */}
                  <span>Meta</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Đã có tài khoản?{" "}
                <a href="/public-pages/login" className="underline underline-offset-4">
                  Đăng nhập
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/placeholder.svg"
              alt="Hình nền trang đăng ký"
              fill
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              priority
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Khi tiếp tục, bạn đồng ý với <a href="/public-pages/terms-of-use">Điều khoản dịch vụ</a>{" "}
        và <a href="/public-pages/privacy">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
}
