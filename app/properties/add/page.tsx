"use client";
import { useRouter } from "next/navigation";
import { PropertyFormDialog } from "@/components/property/property-form-dialog";
import { getAuth } from "firebase/auth";
import { useState } from "react";

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAdd = async (data: any) => {
    setLoading(true);
    try {
      const user = getAuth().currentUser;
      if (!user) throw new Error("Chưa đăng nhập");
      const token = await user.getIdToken();
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Thêm mới thất bại");
      router.push("/properties");
    } catch (e) {
      alert("Thêm mới thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <PropertyFormDialog
          open={true}
          onClose={() => router.push("/properties")}
          onSubmit={handleAdd}
          loading={loading}
        />
      </div>
    </div>
  );
}
