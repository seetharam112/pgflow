import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/response';
import * as tenantService from '../services/tenant.service';

export async function createTenant(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const tenant = await tenantService.createTenant({
    ...req.body,
    organizationId: orgId,
  });
  successResponse(res, tenant, 'Tenant created successfully', 201);
}

export async function getTenants(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const tenants = await tenantService.getTenantsByOrganization(orgId);
  successResponse(res, tenants, 'Tenants fetched successfully');
}

export async function getTenant(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const tenant = await tenantService.getTenantById(req.params.id, orgId);
  successResponse(res, tenant, 'Tenant fetched successfully');
}

export async function updateTenant(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const tenant = await tenantService.updateTenant(req.params.id, orgId, req.body);
  successResponse(res, tenant, 'Tenant updated successfully');
}

export async function deleteTenant(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  await tenantService.deleteTenant(req.params.id, orgId);
  successResponse(res, null, 'Tenant deleted successfully');
}
