import { Appointment } from "@/models/appointment";
import { Client } from "@/models/client";
import { Property } from "@/models/property";
import { useEffect, useState } from "react";
import { AppointmentCard } from "./appointment-card";

interface AppointmentListProps {
  appointments: Appointment[];
  clients: Client[];
  properties: Property[];
  onSelect?: (appointment: Appointment) => void;
}

export function AppointmentList({ appointments, clients, properties, onSelect }: AppointmentListProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      {appointments.length === 0 && (
        <div className="text-center text-gray-400 py-8">Không có lịch hẹn nào</div>
      )}
      {appointments.map((a) => (
        <AppointmentCard
          key={a.id}
          appointment={a}
          client={clients.find((c) => c.id === a.clientId)}
          properties={properties.filter((p) => a.propertyIds.includes(p.id))}
          onClick={() => onSelect?.(a)}
        />
      ))}
    </div>
  );
}
