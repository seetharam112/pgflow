import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    organizationId: string | null;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: string;
  };
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  organizationId: string | null;
}
