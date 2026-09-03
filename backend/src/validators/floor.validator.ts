import { z } from 'zod';

export const createFloorSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  name: z.string().min(1, 'Name is required'),
  floorNumber: z.number().int('Floor number must be an integer'),
});

export const updateFloorSchema = z.object({
  name: z.string().optional(),
  floorNumber: z.number().int().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});
