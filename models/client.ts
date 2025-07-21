import { Timestamp } from "firebase/firestore";

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
