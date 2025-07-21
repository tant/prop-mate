"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Client } from "@/models/client";

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/clients/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(res => res.json())
      .then(data => {
        setClient(data);
        setName(data.name || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setNotes(data.notes || "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim()) {
      setError("Vui lòng nhập tên và số điện thoại.");
      return;
    }
    setSaving(true);
    const res = await fetch(`/api/clients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, phone, email, notes }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/clients");
    } else {
      const data = await res.json();
      setError(data.error || "Đã có lỗi xảy ra.");
    }
  };

  if (loading) return <div className="flex justify-center py-12">Đang tải...</div>;
  if (!client) return <div className="text-center py-12">Không tìm thấy khách hàng.</div>;

  return (
    <div className="max-w-xl mx-auto w-full px-2 py-6">
      <h1 className="text-2xl font-bold mb-4">Chỉnh sửa Khách hàng</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tên khách hàng *</label>
          <Input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input value={email} onChange={e => setEmail(e.target.value)} type="email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ghi chú</label>
          <Input value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        {error && <div className="text-error text-sm">{error}</div>}
        <div className="flex gap-2 mt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/clients")}>Hủy</Button>
        </div>
      </form>
    </div>
  );
}
