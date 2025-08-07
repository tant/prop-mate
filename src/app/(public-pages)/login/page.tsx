import { LoginForm } from "@/components/login-form";
import { redirect } from "next/navigation";
import { getServerUser } from "@/server/auth/getServerUser";

export default async function LoginPage() {
  const user = await getServerUser();
  if (user) redirect("/dashboard");
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
