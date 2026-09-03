import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/response';
import { registerUser, loginUser, refreshAccessToken } from '../services/auth.service';

export async function register(req: AuthenticatedRequest, res: Response) {
  const result = await registerUser(req.body);
  successResponse(res, result, 'User registered successfully', 201);
}

export async function login(req: AuthenticatedRequest, res: Response) {
  const result = await loginUser(req.body);
  successResponse(res, result, 'Login successful');
}

export async function refresh(req: AuthenticatedRequest, res: Response) {
  const { refreshToken } = req.body;
  const result = await refreshAccessToken(refreshToken);
  successResponse(res, result, 'Token refreshed successfully');
}

export async function me(req: AuthenticatedRequest, res: Response) {
  successResponse(res, req.user, 'User profile fetched');
}

export async function logout(_req: AuthenticatedRequest, res: Response) {
  // Stateless JWT: client discards tokens
  successResponse(res, null, 'Logged out successfully');
}
