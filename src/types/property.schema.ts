import { z } from "zod";

// Các enum dùng cho property
export const propertyTypeEnum = z.enum(["APARTMENT", "HOUSE", "LAND", "VILLA", "OFFICE"]);
export const listingTypeEnum = z.enum(["sale", "rent"]);
export const statusEnum = z.enum(["DRAFT", "AVAILABLE", "PENDING", "SOLD", "RENTED"]);
export const interiorStatusEnum = z.enum(["FURNISHED", "UNFURNISHED", "PARTIALLY_FURNISHED"]);
export const legalStatusEnum = z.enum(["PINK_BOOK", "RED_BOOK", "SALE_CONTRACT"]);
export const currentStatusEnum = z.enum(["VACANT", "OCCUPIED", "RENTED_OUT"]);
export const contactRoleEnum = z.enum(["OWNER", "AGENT", "REPRESENTATIVE", "OTHER"]);
export const ownershipTypeEnum = z.enum(["OWNER", "AGENT", "EXCLUSIVE", "CONSIGNMENT"]);

// Zod schema cho property
export const propertySchema = z.object({
  id: z.string(),
  memorableName: z.string(),
  propertyType: propertyTypeEnum,
  listingType: listingTypeEnum,
  status: statusEnum,
  location: z.object({
    city: z.string().optional(),
    district: z.string().optional(),
    ward: z.string().optional(),
    street: z.string().optional(),
    fullAddress: z.string(),
    gps: z.object({ lat: z.number(), lng: z.number() }).optional(),
  }),
  projectId: z.string().optional(),
  projectName: z.string().optional(),
  area: z.number(),
  frontage: z.number().optional(),
  direction: z.string().optional(),
  floor: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  interiorStatus: interiorStatusEnum.optional(),
  amenities: z.array(z.string()).optional(),
  totalFloors: z.number().optional(),
  unitsPerFloor: z.number().optional(),
  handoverDate: z.coerce.date().optional(),
  currentStatus: currentStatusEnum.optional(),
  price: z.object({
    value: z.number(),
    pricePerSqm: z.number().optional(),
  }),
  commission: z.object({
    rate: z.number().optional(),
    value: z.number().optional(),
  }).optional(),
  serviceFee: z.number().optional(),
  legalStatus: legalStatusEnum.optional(),
  legalNote: z.string().optional(),
  documents: z.array(z.object({ name: z.string(), url: z.string() })).optional(),
  imageUrls: z.array(z.string()),
  images360: z.array(z.string()).optional(),
  videoUrls: z.array(z.string()).optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  contactRole: contactRoleEnum.optional(),
  ownershipType: ownershipTypeEnum.optional(),
  notes: z.array(z.object({
    content: z.string(),
    createdAt: z.coerce.date(),
    createdBy: z.string(),
  })).optional(),
  statusHistory: z.array(z.object({
    status: statusEnum,
    changedAt: z.coerce.date(),
    changedBy: z.string(),
  })).optional(),
  postedAt: z.coerce.date().optional(),
  expiredAt: z.coerce.date().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  listingDuration: z.number().optional(),
});

// Schema cho tạo mới (bỏ id, createdAt, updatedAt)
export const propertyCreateSchema = propertySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema cho update (chỉ cho phép partial)
export const propertyUpdateSchema = propertySchema.partial();
