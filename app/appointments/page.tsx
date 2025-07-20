"use client";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { ClipLoader } from "react-spinners";

export default function AppointmentsPage() {
  const { user, checking } = useAuthGuard();

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader size={48} color="#2563eb" speedMultiplier={0.9} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Lịch hẹn</h1>
      {user && (
        <div className="mb-4 text-green-700 text-lg">
          Đã đăng nhập:{" "}
          <span className="font-semibold">
            {user.displayName || user.email}
          </span>
        </div>
      )}
    </div>
  );
}
