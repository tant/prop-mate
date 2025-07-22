import { Timestamp } from "firebase/firestore";

// Bất động sản
export interface Property {
  id: string;
  memorableName: string; // Tên gợi nhớ
  price: number; // Giá bán
  imageUrls: string[]; // Danh sách URL hình ảnh
  address?: string;
  gps?: { lat: number; lng: number };
  area?: number;
  legalStatus?: string;
  frontage?: number;
  direction?: string;
  bedrooms?: number;
  bathrooms?: number;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Chuyển Firestore doc sang Property
export function propertyFromDoc(doc: any): Property {
  return {
    id: doc.id,
    memorableName: doc.memorableName,
    price: doc.price,
    imageUrls: doc.imageUrls || [],
    address: doc.address,
    gps: doc.gps,
    area: doc.area,
    legalStatus: doc.legalStatus,
    frontage: doc.frontage,
    direction: doc.direction,
    bedrooms: doc.bedrooms,
    bathrooms: doc.bathrooms,
    notes: doc.notes,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// Chuyển Property sang Firestore data
export function propertyToFirestore(property: Omit<Property, "id">) {
  return {
    ...property,
  };
}
