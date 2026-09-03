import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/response';
import * as assignmentService from '../services/bedAssignment.service';
import * as tenantService from '../services/tenant.service';

export async function moveIn(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  await tenantService.getTenantById(req.body.tenantId, orgId);
  const assignment = await assignmentService.moveIn(req.body);
  successResponse(res, assignment, 'Tenant moved in successfully', 201);
}

export async function moveOut(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const assignment = await assignmentService.moveOut(req.params.id);
  successResponse(res, assignment, 'Tenant moved out successfully');
}

export async function getAssignmentsByTenant(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  await tenantService.getTenantById(req.params.tenantId, orgId);
  const assignments = await assignmentService.getAssignmentsByTenant(req.params.tenantId);
  successResponse(res, assignments, 'Assignments fetched successfully');
}

export async function getActiveAssignments(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const assignments = await assignmentService.getActiveAssignmentsByOrganization(orgId);
  successResponse(res, assignments, 'Active assignments fetched successfully');
}
