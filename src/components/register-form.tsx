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
import { api } from "@/app/_trpc/client";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { userCreateSchema } from "@/types/user.schema";


const registerSchema = userCreateSchema.extend({
  password: z.string()
    .min(8, "Tối thiểu 8 ký tự")
    .regex(/[A-Z]/, "Phải có chữ hoa (A-Z)")
    .regex(/[a-z]/, "Phải có chữ thường (a-z)")
    .regex(/[0-9]/, "Phải có số (0-9)")
    .regex(/[^A-Za-z0-9]/, "Phải có ký tự đặc biệt (!@#$...)")
    .max(64, "Tối đa 64 ký tự"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
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

  const createUser = api.user.create.useMutation();

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setServerError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const idToken = await result.user.getIdToken();
      // Tạo một user trong firestore qua tRPC
      await createUser.mutateAsync({
        uid: result.user.uid,
        email: data.email,
        firstName: data.firstName,
      });
      await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { code?: string };
      const errorMessages: Record<string, string> = {
        "auth/email-already-in-use": "Email này đã được đăng ký. Vui lòng dùng email khác.",
        "auth/invalid-email": "Email không hợp lệ.",
        "auth/weak-password": "Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.",
      };
      if (error?.code && errorMessages[error.code]) {
        setServerError(errorMessages[error.code]);
      } else {
        setServerError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper: kiểm tra từng điều kiện password (chỉ dùng trong PasswordRequirements)
  function PasswordRequirements({ password }: { password: string }) {
    const passwordChecks = [
      {
        label: "Tối thiểu 8 ký tự",
        test: (pw: string) => pw.length >= 8,
      },
      {
        label: "Có chữ hoa (A-Z)",
        test: (pw: string) => /[A-Z]/.test(pw),
      },
      {
        label: "Có chữ thường (a-z)",
        test: (pw: string) => /[a-z]/.test(pw),
      },
      {
        label: "Có số (0-9)",
        test: (pw: string) => /[0-9]/.test(pw),
      },
      {
        label: "Có ký tự đặc biệt (!@#$...)",
        test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
      },
    ];
    return (
      <ul className="list-disc ml-5">
        {passwordChecks.map((item) => (
          <li key={item.label} className={item.test(password) ? "text-green-600" : ""}>
            {item.label}
          </li>
        ))}
      </ul>
    );
  }

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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("password")}
                    disabled={loading}
                    aria-invalid={!!errors.password}
                    aria-describedby="password-help password-error"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-2.5 p-1 text-muted-foreground hover:text-primary"
                    style={{background: 'none', border: 'none', cursor: 'pointer'}}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
                  <PasswordRequirements password={passwordValue ?? ""} />
                </div>
                {errors.password && (
                  <span id="password-error" className="text-destructive text-xs mt-1">{errors.password.message}</span>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    disabled={loading}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby="confirmPassword-error"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-2.5 p-1 text-muted-foreground hover:text-primary"
                    style={{background: 'none', border: 'none', cursor: 'pointer'}}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
              <Button type="submit" className="w-full" disabled={loading || !isValid}>
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
                <Link href="/public-pages/login" className="underline underline-offset-4">
                  Đăng nhập
                </Link>
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
