import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/response';
import * as dashboardService from '../services/dashboard.service';

export async function getDashboardStats(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const stats = await dashboardService.getDashboardStats(orgId);
  successResponse(res, stats, 'Dashboard stats fetched successfully');
}

export async function getOccupancyBreakdown(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const breakdown = await dashboardService.getOccupancyBreakdown(orgId);
  successResponse(res, breakdown, 'Occupancy breakdown fetched successfully');
}
