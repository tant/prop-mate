import { Timestamp } from "firebase-admin/firestore";

export interface Appointment {
  id: string;
  clientId: string;
  propertyIds: string[];
  time: Timestamp;
  meetingPoint: string;
  status: "upcoming" | "past" | "cancelled";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function appointmentFromDoc(doc: any): Appointment {
  return {
    id: doc.id,
    clientId: doc.clientId,
    propertyIds: doc.propertyIds,
    time: doc.time,
    meetingPoint: doc.meetingPoint,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export function appointmentToFirestore(appointment: Omit<Appointment, "id">) {
  return {
    ...appointment,
  };
}
