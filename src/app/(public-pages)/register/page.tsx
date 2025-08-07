import { RegisterForm } from "@/components/register-form";
import TRPCProvider from "@/app/_trpc/TRPCProvider";

export default function RegisterPage() {
  return (
    <TRPCProvider>
      <RegisterForm />
    </TRPCProvider>
  );
}
