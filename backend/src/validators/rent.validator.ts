import { z } from 'zod';

export const createRentSchema = z.object({
  tenantId: z.string().uuid('Invalid tenant ID'),
  assignmentId: z.string().uuid('Invalid assignment ID'),
  amount: z.number().positive('Amount must be a positive number'),
  dueDate: z.string().datetime().transform((v) => new Date(v)),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
});

export const updateRentSchema = z.object({
  amount: z.number().positive().optional(),
  dueDate: z.string().datetime().optional().transform((v) => v ? new Date(v) : undefined),
  month: z.number().int().min(1).max(12).optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  status: z.enum(['PENDING', 'PARTIAL', 'PAID']).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});
