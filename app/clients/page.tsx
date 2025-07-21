"use client";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { ClipLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Client } from "@/models/client";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { toast } from "sonner";

export default function ClientsPage() {
  const { user, checking } = useAuthGuard();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getAuth().currentUser?.getIdToken().then(token => {
      fetch("/api/clients", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => Array.isArray(data) ? setClients(data) : setClients([]))
        .finally(() => setLoading(false));
    });
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) return;
    setLoading(true);
    try {
      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      setClients(prev => prev.filter(c => c.id !== id));
      toast.success("Đã xóa khách hàng thành công!");
    } catch {
      toast.error("Xóa khách hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader size={48} color="#2563eb" speedMultiplier={0.9} />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto w-full px-2 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Khách hàng</h1>
        <Button onClick={() => router.push("/clients/add")}>
          <span className="hidden sm:inline">Thêm Khách hàng mới</span>
          <span className="sm:hidden">+</span>
        </Button>
      </div>
      <Input
        placeholder="Tìm kiếm khách hàng..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4"
      />
      {loading ? (
        <div className="flex justify-center py-12">
          <ClipLoader size={32} color="#2563eb" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">Chưa có khách hàng nào, hãy thêm mới!</div>
      ) : (
        <div className="flex flex-col gap-3">
          {clients
            .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
            .map(client => (
              <Card key={client.id} className="flex items-center justify-between px-4 py-3">
                <div onClick={() => router.push(`/clients/${client.id}/edit`)} className="flex-1 cursor-pointer">
                  <div className="font-semibold text-primary text-base">{client.name}</div>
                  <div className="text-sm text-secondary-foreground">{client.phone}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" aria-label="Chỉnh sửa" onClick={() => router.push(`/clients/${client.id}/edit`)}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z"/></svg>
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Xóa" onClick={() => handleDelete(client.id)}>
                    <svg width="20" height="20" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      )}
      {/* Modal add/edit, confirm delete sẽ bổ sung sau */}
    </div>
  );
}
