import { Timestamp } from "firebase/firestore";

// Cuộc hẹn giữa khách và bất động sản
export interface Appointment {
  id: string;
  clientId: string; // ID khách hàng
  propertyIds: string[]; // Danh sách ID bất động sản
  time: Timestamp; // Thời gian hẹn
  meetingPoint: string; // Điểm gặp
  status: "upcoming" | "past" | "cancelled"; // Trạng thái
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Chuyển Firestore doc sang Appointment
export function appointmentFromDoc(doc: any): Appointment {
  return {
    id: doc.id,
    clientId: doc.clientId,
    propertyIds: doc.propertyIds || [],
    time: doc.time,
    meetingPoint: doc.meetingPoint,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// Chuyển Appointment sang Firestore data
export function appointmentToFirestore(appointment: Omit<Appointment, "id">) {
  return {
    ...appointment,
  };
}
