import { RegisterForm } from "@/components/register-form";
import TRPCProvider from "@/app/_trpc/TRPCProvider";
import { redirect } from "next/navigation";
import { getServerUser } from "@/server/auth/getServerUser";

export default async function RegisterPage() {
  const user = await getServerUser();
  if (user) redirect("/dashboard");

  return (
    <TRPCProvider>
      <RegisterForm />
    </TRPCProvider>
  );
}
