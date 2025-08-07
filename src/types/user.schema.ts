import { z } from "zod";

// Zod schema cho user tạo mới
export const userCreateSchema = z.object({
  uid: z.string().min(1, "UID is required from Firebase Auth"),
  email: z.string().email("Invalid email format."),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
});

// Zod schema cho user update
export const userUpdateSchema = z.object({
  uid: z.string().min(1),
  data: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phoneNumber: z.string().optional(),
      address: z.string().optional(),
      profileImage: z.string().optional(),
    })
    .refine((data) => Object.values(data).some((v) => v !== undefined && v !== null && v !== ""), {
      message: "At least one field must be provided to update.",
    }),
});

// Có thể bổ sung thêm các schema khác nếu cần
