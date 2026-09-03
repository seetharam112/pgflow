import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthenticatedRequest, TokenPayload } from '../types';
import { UnauthorizedError } from '../utils/errors';

export function authenticateToken(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    next(new UnauthorizedError('Access token required'));
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      organizationId: decoded.organizationId,
    };
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}
