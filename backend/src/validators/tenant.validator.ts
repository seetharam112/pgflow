import { z } from 'zod';

export const createTenantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email().optional(),
  deposit: z.number().nonnegative().optional(),
});

export const updateTenantSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  deposit: z.number().nonnegative().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});
