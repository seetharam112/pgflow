import { z } from 'zod';

export const moveInSchema = z.object({
  tenantId: z.string().uuid('Invalid tenant ID'),
  bedId: z.string().uuid('Invalid bed ID'),
  rent: z.number().positive('Rent must be a positive number'),
  startDate: z.string().datetime().optional().transform((v) => (v ? new Date(v) : undefined)),
});
