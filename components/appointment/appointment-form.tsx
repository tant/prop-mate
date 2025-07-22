import { Appointment } from "@/models/appointment";
import { Client } from "@/models/client";
import { Property } from "@/models/property";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClientCombobox } from "./client-combobox";

interface AppointmentFormProps {
  clients: Client[];
  properties: Property[];
  onSubmit: (data: Omit<Appointment, "id" | "createdAt" | "updatedAt" | "status">) => void;
  initial?: Partial<Appointment>;
}

export function AppointmentForm({ clients, properties, onSubmit, initial }: AppointmentFormProps) {
  const [clientId, setClientId] = useState(initial?.clientId || "");
  const [propertyIds, setPropertyIds] = useState<string[]>(initial?.propertyIds || []);
  const [time, setTime] = useState(initial?.time ? new Date(initial.time.toDate()).toISOString().slice(0, 16) : "");
  const [meetingPoint, setMeetingPoint] = useState(initial?.meetingPoint || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || propertyIds.length === 0 || !time || !meetingPoint) return;
    onSubmit({
      clientId,
      propertyIds,
      time: new Date(time),
      meetingPoint,
    } as any);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Tạo Lịch hẹn mới</h2>
      <div>
        <label className="block mb-1">Khách hàng</label>
        <ClientCombobox clients={clients} value={clientId} onChange={setClientId} />
      </div>
      <div>
        <label className="block mb-1">BĐS</label>
        <Select value={propertyIds[0] || ""} onValueChange={(v) => setPropertyIds([v])}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn BĐS" />
          </SelectTrigger>
          <SelectContent>
            {properties.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.memorableName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-1">Thời gian</label>
        <Input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} required />
      </div>
      <div>
        <label className="block mb-1">Điểm hẹn</label>
        <Textarea value={meetingPoint} onChange={(e) => setMeetingPoint(e.target.value)} required />
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <Button type="submit">Lưu</Button>
      </div>
    </form>
  );
}
