import { z } from 'zod';

export const createComplaintSchema = z.object({
  tenantId: z.string().uuid('Invalid tenant ID'),
  propertyId: z.string().uuid('Invalid property ID'),
  roomId: z.string().uuid('Invalid room ID').optional(),
  category: z.string().min(1, 'Category is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
});

export const updateComplaintSchema = z.object({
  status: z.enum(['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedTo: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});
