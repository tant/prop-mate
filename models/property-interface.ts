export interface Property {
  id: string;
  memorableName: string;
  address: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  legalStatus?: string;
  direction?: string;
  frontage?: number;
  imageUrls: string[];
  notes?: string;
  createdAt?: { seconds: number } | string | Date;
}
