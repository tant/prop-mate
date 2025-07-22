import { Timestamp } from "firebase/firestore";

// Khách hàng
export interface Client {
  id: string;
  name: string; // Tên khách hàng
  phone: string; // SĐT
  email?: string;
  notes?: string;
  searchCriteria?: {
    propertyType?: string;
    locations?: string[];
    priceMin?: number;
    priceMax?: number;
  };
  source?: string; // Nguồn khách hàng
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Chuyển Firestore doc sang Client
export function clientFromDoc(doc: any): Client {
  return {
    id: doc.id,
    name: doc.name,
    phone: doc.phone,
    email: doc.email,
    notes: doc.notes,
    searchCriteria: doc.searchCriteria,
    source: doc.source,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// Chuyển Client sang Firestore data
export function clientToFirestore(client: Omit<Client, "id">) {
  return {
    ...client,
  };
}
