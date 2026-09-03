import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/response';
import * as rentService from '../services/rent.service';

export async function createRent(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const rent = await rentService.createRent(req.body);
  successResponse(res, rent, 'Rent record created successfully', 201);
}

export async function getRents(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const rents = await rentService.getRentsByOrganization(orgId);
  successResponse(res, rents, 'Rent records fetched successfully');
}

export async function getRent(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const rent = await rentService.getRentById(req.params.id, orgId);
  successResponse(res, rent, 'Rent record fetched successfully');
}

export async function getTenantRents(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const rents = await rentService.getRentsByTenant(req.params.tenantId, orgId);
  successResponse(res, rents, 'Tenant rent records fetched successfully');
}

export async function updateRent(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const data = req.body;
  if (data.dueDate) data.dueDate = new Date(data.dueDate);
  const rent = await rentService.updateRent(req.params.id, orgId, data);
  successResponse(res, rent, 'Rent record updated successfully');
}

export async function deleteRent(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  await rentService.deleteRent(req.params.id, orgId);
  successResponse(res, null, 'Rent record deleted successfully');
}
