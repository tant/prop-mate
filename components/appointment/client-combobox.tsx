import { Client } from "@/models/client";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ClientComboboxProps {
  clients: Client[];
  value: string;
  onChange: (id: string) => void;
}

export function ClientCombobox({ clients, value, onChange }: ClientComboboxProps) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search) return clients;
    return clients.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, clients]);

  return (
    <div className="relative w-full">
      <Input
        placeholder="Tìm khách hàng theo tên, SĐT, email..."
        value={search || clients.find(c => c.id === value)?.name || ""}
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setSearch("")}
        className="mb-1"
      />
      <div className="absolute z-10 bg-white border rounded w-full max-h-56 overflow-auto shadow mt-1">
        {filtered.length === 0 && (
          <div className="p-2 text-gray-400 text-sm">Không tìm thấy khách hàng</div>
        )}
        {filtered.map(c => (
          <div
            key={c.id}
            className={cn(
              "px-3 py-2 cursor-pointer hover:bg-blue-100",
              value === c.id && "bg-blue-50 font-semibold"
            )}
            onMouseDown={() => { onChange(c.id); setSearch(""); }}
          >
            <span>{c.name}</span>
            <span className="ml-2 text-xs text-gray-500">{c.phone}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
