import { z } from 'zod';

export const updateOrganizationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const inviteUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['MANAGER', 'STAFF', 'TENANT']),
});
