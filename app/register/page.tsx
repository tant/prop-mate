"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      router.push("/properties");
    } catch (err: any) {
      let msg = "Đăng ký thất bại";
      if (err.code === "auth/email-already-in-use") msg = "Email đã được sử dụng";
      else if (err.code === "auth/invalid-email") msg = "Email không hợp lệ";
      else if (err.code === "auth/weak-password") msg = "Mật khẩu quá yếu (tối thiểu 6 ký tự)";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-sm mx-auto mt-16 p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Đăng ký</h2>
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
            rules={{ required: "Vui lòng nhập mật khẩu", minLength: { value: 6, message: "Mật khẩu tối thiểu 6 ký tự" } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input {...field} type="password" autoComplete="new-password" placeholder="Nhập mật khẩu" title="Mật khẩu" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </form>
      </Form>
      <div className="text-center mt-4 text-sm">
        Đã có tài khoản?{' '}
        <a href="/login" className="text-blue-600 hover:underline">Đăng nhập</a>
      </div>
    </Card>
  );
}
