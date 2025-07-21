"use client";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddClientPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim()) {
      setError("Vui lòng nhập tên và số điện thoại.");
      return;
    }
    setLoading(true);
    try {
      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone, email, notes }),
      });
      setLoading(false);
      if (res.ok) {
        router.push("/clients");
      } else {
        const data = await res.json();
        setError(data.error || "Đã có lỗi xảy ra.");
      }
    } catch {
      setLoading(false);
      setError("Đã có lỗi xảy ra.");
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full px-2 py-6">
      <h1 className="text-2xl font-bold mb-4">Thêm Khách hàng mới</h1>
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
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/clients")}>Hủy</Button>
        </div>
      </form>
    </div>
  );
}
