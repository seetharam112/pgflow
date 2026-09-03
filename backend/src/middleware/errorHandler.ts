import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { errorResponse } from '../utils/response';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    errorResponse(res, err.message, err.code, err.statusCode);
    return;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      errorResponse(res, 'A record with this value already exists.', 'DUPLICATE_RECORD', 409);
      return;
    }
    if (prismaError.code === 'P2025') {
      errorResponse(res, 'Record not found.', 'NOT_FOUND', 404);
      return;
    }
  }

  console.error('Unhandled error:', err);
  errorResponse(res, 'An unexpected error occurred.', 'INTERNAL_ERROR', 500);
}
