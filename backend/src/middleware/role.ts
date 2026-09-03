import { Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { ForbiddenError } from '../utils/errors';

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError('Authentication required'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError('Insufficient permissions'));
      return;
    }

    next();
  };
}

export function requireOrganization(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new ForbiddenError('Authentication required'));
    return;
  }

  if (!req.user.organizationId) {
    next(new ForbiddenError('User must belong to an organization'));
    return;
  }

  next();
}
