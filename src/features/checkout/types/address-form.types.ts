import * as z from "zod";

export const addressSchema = z.object({
  address_type: z.enum(["home", "office", "other"]),
  address: z
    .string()
    .min(10, "Manzil kamida 10 ta belgidan iborat bo'lishi kerak"),
  city: z.string().min(1, "Shahar/Viloyat talab qilinadi"),
  country: z.string().optional(),
  zip: z.string().optional(),
  contact_person_name: z
    .string()
    .min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  contact_person_number: z
    .string()
    .regex(/^\+998\d{9}$/, "To'g'ri telefon raqam kiriting (+998901234567)"),
  phone: z
    .string()
    .regex(/^\+998\d{9}$/, "To'g'ri telefon raqam kiriting (+998901234567)"),
  region_id: z.number().min(1, "Viloyatni tanlang"),
  district_id: z.number().min(1, "Tumanni tanlang"),
  is_billing: z.boolean(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

export interface InitialAddressData {
  address: string;
  city?: string;
  country?: string;
  zip?: string;
  region?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
}

export const TASHKENT_CENTER: [number, number] = [69.2401, 41.2995];

