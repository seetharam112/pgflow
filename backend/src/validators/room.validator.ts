import { z } from 'zod';

export const createRoomSchema = z.object({
  floorId: z.string().uuid('Invalid floor ID'),
  roomNumber: z.string().min(1, 'Room number is required'),
  capacity: z.number().int().positive('Capacity must be a positive integer'),
});

export const updateRoomSchema = z.object({
  roomNumber: z.string().optional(),
  capacity: z.number().int().positive().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});
