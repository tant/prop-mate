"use client";

import { api } from "@/app/_trpc/client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PropertySeedPage() {
  const [count, setCount] = useState(50);
  const [description, setDescription] = useState(
    "nhà ở trong khu vực thành phố hồ chí minh có giá 850 triệu tới 4 tỉ"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tạo mutation instance đúng chuẩn trpc
  const createProperty = api.property.create.useMutation();

  // Gọi API để sinh preview
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/properties/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count, description }),
      });
      const data = await res.json();
      if (res.ok && data.preview && Array.isArray(data.preview)) {
        let successCount = 0;
        let failCount = 0;
        for (const property of data.preview) {
          try {
            const input = { ...property };
            delete input.id;
            delete input.agentId;
            delete input.createdAt;
            delete input.updatedAt;
            await createProperty.mutateAsync(input);
            successCount++;
          } catch (err) {
            failCount++;
            console.error("Lỗi khi seed property:", err);
          }
        }
        setResult(
          `Đã lưu thành công ${successCount} property vào database!${failCount ? ` (${failCount} lỗi)` : ""}`
        );
      } else {
        setError(data.error || "Có lỗi xảy ra khi gọi API.");
      }
    } catch {
      setError("Có lỗi xảy ra khi gọi API.");
    } finally {
      setLoading(false);
    }
  };

  // Đã tự động lưu khi submit, không cần handleSave nữa

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Seed dữ liệu bất động sản</CardTitle>
          <CardDescription>
            Sinh nhanh dữ liệu property mẫu để test hệ thống.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
          <div className="space-y-2">
            <Label htmlFor="count-input">Số lượng (1-5):</Label>
            <Input
              id="count-input"
              type="number"
              min={1}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              required
              className="w-24"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description-input">Mô tả (giúp AI sinh dữ liệu phù hợp):</Label>
            <textarea
              id="description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={5}
              rows={3}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 outline-none"
              placeholder="Ví dụ: Nhà phố trung tâm, diện tích lớn, gần trường học, nội thất cao cấp..."
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang sinh dữ liệu..." : "Seed dữ liệu"}
          </Button>
          {/* Không hiện preview, chỉ hiện kết quả cuối cùng */}
          {result && (
            <div className="mt-4 text-success font-medium">{result}</div>
          )}
          {error && (
            <div className="mt-4 text-destructive">{error}</div>
          )}
        </form>
      </Card>
    </div>
  );
}
