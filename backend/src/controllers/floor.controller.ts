import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/response';
import * as floorService from '../services/floor.service';
import * as propertyService from '../services/property.service';
import { ForbiddenError, BadRequestError } from '../utils/errors';

export async function createFloor(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  await propertyService.getPropertyById(req.body.propertyId, orgId);
  const floor = await floorService.createFloor(req.body);
  successResponse(res, floor, 'Floor created successfully', 201);
}

export async function getFloors(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const propertyId = req.query.propertyId as string;
  if (!propertyId) throw new BadRequestError('propertyId query parameter is required');
  await propertyService.getPropertyById(propertyId, orgId);
  const floors = await floorService.getFloorsByProperty(propertyId);
  successResponse(res, floors, 'Floors fetched successfully');
}

export async function getFloor(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const floor = await floorService.getFloorById(req.params.id);
  if (floor.property.organizationId !== orgId) {
    throw new ForbiddenError('Access denied');
  }
  successResponse(res, floor, 'Floor fetched successfully');
}

export async function updateFloor(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const floor = await floorService.getFloorById(req.params.id);
  if (floor.property.organizationId !== orgId) {
    throw new ForbiddenError('Access denied');
  }
  const updated = await floorService.updateFloor(req.params.id, req.body);
  successResponse(res, updated, 'Floor updated successfully');
}

export async function deleteFloor(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const floor = await floorService.getFloorById(req.params.id);
  if (floor.property.organizationId !== orgId) {
    throw new ForbiddenError('Access denied');
  }
  await floorService.deleteFloor(req.params.id);
  successResponse(res, null, 'Floor deleted successfully');
}
