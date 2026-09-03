import { z } from 'zod';

export const createBedSchema = z.object({
  roomId: z.string().uuid('Invalid room ID'),
  bedNumber: z.string().min(1, 'Bed number is required'),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).optional(),
  monthlyRent: z.number().positive().optional(),
});

export const updateBedSchema = z.object({
  bedNumber: z.string().optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).optional(),
  monthlyRent: z.number().positive().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});
