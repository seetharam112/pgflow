import { Response } from 'express';
import { ApiResponse } from '../types';

export function successResponse<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
}

export function errorResponse(res: Response, message: string, code: string, statusCode: number = 500, details?: string): void {
  const response: ApiResponse = {
    success: false,
    message,
    error: {
      code,
      ...(details && { details }),
    },
  };
  res.status(statusCode).json(response);
}
