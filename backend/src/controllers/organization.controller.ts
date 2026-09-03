import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/response';
import * as orgService from '../services/organization.service';

export async function getMyOrganization(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const org = await orgService.getOrganization(orgId);
  successResponse(res, org, 'Organization fetched successfully');
}

export async function updateOrganization(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const org = await orgService.updateOrganization(orgId, req.body);
  successResponse(res, org, 'Organization updated successfully');
}

export async function inviteUser(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await orgService.createUser({
    ...req.body,
    organizationId: orgId,
    passwordHash,
  });
  successResponse(res, user, 'User invited successfully', 201);
}

export async function getOrganizationUsers(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const users = await orgService.getUsersByOrganization(orgId);
  successResponse(res, users, 'Users fetched successfully');
}
