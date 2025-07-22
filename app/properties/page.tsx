"use client";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { ClipLoader } from "react-spinners";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyDetailDialog } from "@/components/property/property-detail-dialog";
import { ConfirmDeleteDialog } from "@/components/property/confirm-delete-dialog";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Property } from "@/models/property-interface";

const fetcher = async (url: string) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Chưa đăng nhập");
  const token = await user.getIdToken();
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Lỗi xác thực hoặc tải dữ liệu");
  return res.json();
};

export default function PropertiesPage() {
  const { user, checking } = useAuthGuard();
  const { data, isLoading, error, mutate } = useSWR<Property[]>(
    user ? "/api/properties" : null,
    fetcher
  );
  const [selected, setSelected] = useState<Property | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const user = getAuth().currentUser;
      if (!user) throw new Error("Chưa đăng nhập");
      const token = await user.getIdToken();
      const res = await fetch(`/api/properties/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      setDeleteId(null);
      mutate();
    } catch (e) {
      alert("Xóa thất bại!");
    } finally {
      setDeleting(false);
    }
  };

  // Lọc bất động sản theo tên hoặc địa chỉ
  const filteredData =
    data && Array.isArray(data)
      ? data.filter((p: Property) => {
          const q = search.trim().toLowerCase();
          if (!q) return true;
          return (
            (p.memorableName && p.memorableName.toLowerCase().includes(q)) ||
            (p.address && p.address.toLowerCase().includes(q))
          );
        })
      : [];

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader size={48} color="#2563eb" speedMultiplier={0.9} />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-6 gap-4 z-0">
      <div className="flex items-center justify-between mb-4 z-0">
        <h1 className="text-3xl font-bold">Quản lý Bất động sản</h1>
        <Button
          onClick={() => router.push("/properties/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          + Thêm mới
        </Button>
      </div>
      <div className="mb-4 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      )}
      {error && <div className="text-red-600">Lỗi tải dữ liệu!</div>}
      {(!isLoading && data && Array.isArray(data) && filteredData.length === 0) && (
        <div className="text-gray-500">Không tìm thấy bất động sản phù hợp</div>
      )}
      {(!isLoading && filteredData.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((p: Property) => (
            <PropertyCard
              key={p.id}
              property={p}
              onView={() => setSelected(p)}
              onEdit={() => router.push(`/properties/${p.id}/edit`)}
              onDelete={() => setDeleteId(p.id)}
            />
          ))}
        </div>
      )}
      {/* Modal xem chi tiết */}
      <PropertyDetailDialog
        open={!!selected}
        property={selected}
        onClose={() => setSelected(null)}
        onEdit={
          selected ? () => router.push(`/properties/${selected.id}/edit`) : undefined
        }
        onDelete={
          selected ? () => setDeleteId(selected.id) : undefined
        }
      />
      {/* Modal xác nhận xóa */}
      <ConfirmDeleteDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
