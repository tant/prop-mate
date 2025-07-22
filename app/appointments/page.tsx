"use client";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { ClipLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { fetchAppointments } from "@/lib/appointmentService";
import { fetchClients } from "@/lib/clientService.client";
import { fetchProperties } from "@/lib/propertyService.client";
import { Appointment } from "@/models/appointment";
import { Client } from "@/models/client";
import { Property } from "@/models/property";
import { AppointmentList } from "@/components/appointment/appointment-list";
import { Button } from "@/components/ui/button";

export default function AppointmentsPage() {
  const { user, checking } = useAuthGuard();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      fetchAppointments(),
      fetchClients(),
      fetchProperties(),
    ]).then(([a, c, p]) => {
      setAppointments(a);
      setClients(c);
      setProperties(p);
      setLoading(false);
    });
  }, [user]);

  if (checking || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader size={48} color="#2563eb" speedMultiplier={0.9} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen w-full max-w-2xl mx-auto px-2 py-8">
      <h1 className="text-3xl font-bold mb-2">Lịch hẹn</h1>
      {user && (
        <div className="mb-4 text-green-700 text-lg">
          Đã đăng nhập:{" "}
          <span className="font-semibold">
            {user.displayName || user.email}
          </span>
        </div>
      )}
      <Button
        className="mb-4 self-end"
        onClick={() => {
          window.location.href = "/appointments/add";
        }}
      >
        Tạo Lịch hẹn mới
      </Button>
      <AppointmentList
        appointments={appointments}
        clients={clients}
        properties={properties}
      />
    </div>
  );
}
