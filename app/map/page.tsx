"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Property } from "@/models/property-interface";
import { ConfirmDeleteDialog } from "@/components/property/confirm-delete-dialog";
import { getAuth } from "firebase/auth";

const AllPropertiesMap = dynamic<{
  onSelect?: (property: import("@/models/property-interface").Property | null) => void;
}>(() => import("@/components/property/all-properties-map"), { ssr: false });

export default function MapPage() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Hàm xóa property
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
      setRefreshKey(k => k + 1); // reload lại AllPropertiesMap
    } catch (e) {
      alert("Xóa thất bại!");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] p-6 gap-4">
      <div className="flex-1 min-h-[300px] z-0">
        <AllPropertiesMap onSelect={setSelectedProperty} key={refreshKey} />
      </div>
      <div className="w-full max-w-xl mx-auto mt-2 z-0">
        {selectedProperty ? (
          <div className="p-4 rounded shadow border flex flex-col gap-2 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1">
                <div className="font-bold text-xl text-gray-800 mb-1">{selectedProperty.memorableName}</div>
                <div className="text-gray-600 mb-1 flex items-center gap-1">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path fill="#888" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
                  </svg>
                  {selectedProperty.address}
                </div>
              </div>
              <div className="text-right">
                <div className="text-blue-700 font-bold text-lg">{selectedProperty.price?.toLocaleString()} đ</div>
                <div className="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">ID: {selectedProperty.id}</div>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                onClick={() => window.open(`/properties/${selectedProperty.id}`)}
              >
                Xem chi tiết
              </button>
              <button
                className="px-4 py-2 rounded bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
                onClick={() => window.open(`/properties/${selectedProperty.id}/edit`)}
              >
                Chỉnh sửa
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                onClick={() => setDeleteId(selectedProperty.id)}
                disabled={deleting}
              >
                Xóa
              </button>
            </div>
          </div>
        ) : (
          <span className="text-gray-500 text-lg block text-center">Thông tin sẽ hiện ở đây</span>
        )}
      </div>
      <ConfirmDeleteDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
