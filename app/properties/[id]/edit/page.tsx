"use client";
import { useRouter, useParams } from "next/navigation";
import { PropertyFormDialog } from "@/components/property/property-form-dialog";
import { useState, useEffect } from "react";
import { useAuthGuard } from "@/hooks/use-auth-guard";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { user, checking } = useAuthGuard();
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id || checking) return;
    if (!user) {
      router.push("/login");
      return;
    }
    setFetching(true);
    user.getIdToken().then(token => {
      fetch(`/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => setInitial(data))
        .catch(() => alert("Không tìm thấy bất động sản!"))
        .finally(() => setFetching(false));
    });
  }, [id, user, checking, router]);

  const handleEdit = async (data: any) => {
    setLoading(true);
    try {
      if (!user) throw new Error("Chưa đăng nhập");
      const token = await user.getIdToken();
      const res = await fetch(`/api/properties/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
      router.push("/properties");
    } catch (e) {
      alert("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center items-center min-h-screen">Đang tải...</div>;

  return (
    <div className="flex flex-col min-h-screen p-4 overflow-auto items-center">
      <div className="w-full max-w-lg">
        <PropertyFormDialog
          open={true}
          onClose={() => router.push("/properties")}
          onSubmit={handleEdit}
          initial={initial}
          loading={loading}
        />
      </div>
    </div>
  );
}
