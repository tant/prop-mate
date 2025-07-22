import { Appointment } from "@/models/appointment";
import { Client } from "@/models/client";
import { Property } from "@/models/property";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

interface AppointmentCardProps {
  appointment: Appointment;
  client?: Client;
  properties?: Property[];
  onClick?: () => void;
}

export function AppointmentCard({ appointment, client, properties, onClick }: AppointmentCardProps) {
  return (
    <Card className="w-full p-4 mb-2 cursor-pointer hover:bg-gray-50" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-lg mb-1 flex items-center gap-2">
            <span>🗓️ {appointment.time.toDate().toLocaleString()}</span>
            <Badge
              variant={
                appointment.status === "upcoming"
                  ? "default"
                  : appointment.status === "cancelled"
                  ? "destructive"
                  : "secondary"
              }
            >
              {appointment.status === "upcoming"
                ? "Sắp tới"
                : appointment.status === "cancelled"
                ? "Đã hủy"
                : "Đã qua"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Avatar className="w-6 h-6 text-xs">
              {client?.name?.[0] || "K"}
            </Avatar>
            <span className="font-medium">{client?.name || appointment.clientId}</span>
            <span className="text-gray-400 text-xs">({client?.phone})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {properties?.map((p) => (
              <Badge key={p.id} variant="outline">
                {p.memorableName}
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div>Điểm hẹn: {appointment.meetingPoint}</div>
        </div>
      </div>
    </Card>
  );
}
