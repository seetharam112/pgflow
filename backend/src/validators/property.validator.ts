import { z } from 'zod';

export const createPropertySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'Pincode is required'),
});

export const updatePropertySchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});
