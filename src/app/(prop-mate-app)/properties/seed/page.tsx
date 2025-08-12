"use client";

import { api } from "@/app/_trpc/client";
import { useState } from "react";

export default function PropertySeedPage() {
  const [count, setCount] = useState(2);
  const [description, setDescription] = useState(
    "nhà gần trường học ở quận 3 giá khoảng 850 triệu tới 4 tỉ"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<object[] | string | null>(null);
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
      if (res.ok && data.preview) {
        setResult(data.preview);
      } else {
        setError(data.error || "Có lỗi xảy ra khi gọi API.");
      }
    } catch {
      setError("Có lỗi xảy ra khi gọi API.");
    } finally {
      setLoading(false);
    }
  };

  // Xác nhận lưu từng property qua trpc
  const handleSave = async () => {
    if (!result || !Array.isArray(result)) return;
    setLoading(true);
    setError(null);
    try {
      let successCount = 0;
      let failCount = 0;
      for (const property of result) {
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
          // eslint-disable-next-line no-console
          console.error("Lỗi khi seed property:", err);
        }
      }
      setResult(
        `Đã lưu thành công ${successCount} property vào database!${
          failCount ? ` (${failCount} lỗi)` : ""
        }`
      );
    } catch {
      setError("Có lỗi xảy ra khi lưu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 480,
        margin: "40px auto",
        background: "#fff",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 2px 8px #eee",
      }}
    >
      <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 16 }}>
        Seed dữ liệu bất động sản
      </h2>
      <div style={{ marginBottom: 16 }}>
        <label
          htmlFor="count-input"
          style={{ display: "block", fontWeight: 500, marginBottom: 4 }}
        >
          Số lượng (1-5):
        </label>
        <input
          id="count-input"
          type="number"
          min={1}
          max={5}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          required
          style={{ padding: 8, width: 80 }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label
          htmlFor="description-input"
          style={{ display: "block", fontWeight: 500, marginBottom: 4 }}
        >
          Mô tả (giúp AI sinh dữ liệu phù hợp):
        </label>
        <textarea
          id="description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          minLength={5}
          rows={3}
          style={{ width: "100%", padding: 8 }}
          placeholder="Ví dụ: Nhà phố trung tâm, diện tích lớn, gần trường học, nội thất cao cấp..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{ padding: 10, width: "100%", fontWeight: 600 }}
      >
        {loading ? "Đang sinh dữ liệu..." : "Seed dữ liệu"}
      </button>
      {Array.isArray(result) && (
        <div style={{ marginTop: 20 }}>
          <h4>Kết quả preview ({result.length}):</h4>
          <pre
            style={{
              background: "#f6f6f6",
              padding: 12,
              borderRadius: 6,
              maxHeight: 300,
              overflow: "auto",
              fontSize: 13,
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            style={{
              marginTop: 12,
              padding: 10,
              width: "100%",
              fontWeight: 600,
            }}
          >
            {loading ? "Đang lưu..." : "Xác nhận lưu vào database"}
          </button>
        </div>
      )}
      {typeof result === "string" && (
        <div style={{ marginTop: 20, color: "green", fontWeight: 500 }}>
          {result}
        </div>
      )}
      {error && <div style={{ marginTop: 20, color: "red" }}>{error}</div>}
    </form>
  );
}
