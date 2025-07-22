"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchClients } from "@/lib/clientService.client";
import { fetchProperties } from "@/lib/propertyService.client";
import { Appointment } from "@/models/appointment";
import { Client } from "@/models/client";
import { Property } from "@/models/property";
import { AppointmentForm } from "@/components/appointment/appointment-form";
import { Button } from "@/components/ui/button";

export default function AppointmentAddPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchClients(),
      fetchProperties(),
    ]).then(([c, p]) => {
      setClients(c);
      setProperties(p);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;

  return (
    <div className="flex flex-col items-center min-h-screen w-full max-w-2xl mx-auto px-2 py-8">
      <div className="w-full flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tạo Lịch hẹn mới</h1>
        <Button variant="secondary" onClick={() => router.back()}>Quay lại</Button>
      </div>
      <AppointmentForm
        clients={clients}
        properties={properties}
        onSubmit={() => {}}
      />
    </div>
  );
}
