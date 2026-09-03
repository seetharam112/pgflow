import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/response';
import * as propertyService from '../services/property.service';

export async function createProperty(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const property = await propertyService.createProperty({
    ...req.body,
    organizationId: orgId,
  });
  successResponse(res, property, 'Property created successfully', 201);
}

export async function getProperties(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const properties = await propertyService.getPropertiesByOrganization(orgId);
  successResponse(res, properties, 'Properties fetched successfully');
}

export async function getProperty(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const property = await propertyService.getPropertyById(req.params.id, orgId);
  successResponse(res, property, 'Property fetched successfully');
}

export async function updateProperty(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const property = await propertyService.updateProperty(req.params.id, orgId, req.body);
  successResponse(res, property, 'Property updated successfully');
}

export async function deleteProperty(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  await propertyService.deleteProperty(req.params.id, orgId);
  successResponse(res, null, 'Property deleted successfully');
}
