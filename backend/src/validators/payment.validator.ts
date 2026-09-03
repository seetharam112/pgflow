import { z } from 'zod';

export const createPaymentSchema = z.object({
  rentId: z.string().uuid('Invalid rent ID'),
  amount: z.number().positive('Amount must be a positive number'),
  method: z.enum(['CASH', 'UPI', 'BANK_TRANSFER']),
  reference: z.string().optional(),
});

export const updatePaymentSchema = z.object({
  amount: z.number().positive('Amount must be a positive number').optional(),
  method: z.enum(['CASH', 'UPI', 'BANK_TRANSFER']).optional(),
  reference: z.string().optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});
