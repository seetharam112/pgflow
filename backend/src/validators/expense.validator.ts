import { z } from 'zod';

export const createExpenseSchema = z.object({
  category: z.enum(['ELECTRICITY', 'WATER', 'INTERNET', 'FOOD', 'MAINTENANCE', 'CLEANING', 'SALARY', 'OTHER']),
  amount: z.number().positive('Amount must be a positive number'),
  date: z.string().datetime().transform((v) => new Date(v)),
  description: z.string().optional(),
});

export const updateExpenseSchema = z.object({
  category: z.enum(['ELECTRICITY', 'WATER', 'INTERNET', 'FOOD', 'MAINTENANCE', 'CLEANING', 'SALARY', 'OTHER']).optional(),
  amount: z.number().positive().optional(),
  date: z.string().datetime().optional(),
  description: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});
