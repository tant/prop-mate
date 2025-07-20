"use client";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

const defaultEmail = process.env.NEXT_PUBLIC_FIREBASE_TEST_EMAIL || "";
const defaultPassword = process.env.NEXT_PUBLIC_FIREBASE_TEST_PASSWORD || "";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) {
        router.replace("/dashboard");
      } else {
        setAuthChecking(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const form = useForm({
    defaultValues: {
      email: defaultEmail,
      password: defaultPassword,
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push("/");
    } catch (err: any) {
      let msg = "Đăng nhập thất bại";
      if (err.code === "auth/user-not-found") msg = "Tài khoản không tồn tại";
      else if (err.code === "auth/wrong-password") msg = "Sai mật khẩu";
      else if (err.code === "auth/invalid-email") msg = "Email không hợp lệ";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader size={48} color="#2563eb" speedMultiplier={0.9} />
      </div>
    );
  }

  return (
    <Card className="max-w-sm mx-auto mt-16 p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Đăng nhập</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Vui lòng nhập email",
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: "Email không hợp lệ",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="username" placeholder="Nhập email" title="Email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            rules={{ required: "Vui lòng nhập mật khẩu" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input {...field} type="password" autoComplete="current-password" placeholder="Nhập mật khẩu" title="Mật khẩu" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
