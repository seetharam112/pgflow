import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/response';
import * as bedService from '../services/bed.service';
import * as roomService from '../services/room.service';
import { ForbiddenError, BadRequestError } from '../utils/errors';

export async function createBed(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const room = await roomService.getRoomById(req.body.roomId);
  if (room.floor.property.organizationId !== orgId) {
    throw new ForbiddenError('Access denied');
  }
  const bed = await bedService.createBed(req.body);
  successResponse(res, bed, 'Bed created successfully', 201);
}

export async function getBeds(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const roomId = req.query.roomId as string;
  if (!roomId) throw new BadRequestError('roomId query parameter is required');
  const room = await roomService.getRoomById(roomId);
  if (room.floor.property.organizationId !== orgId) {
    throw new ForbiddenError('Access denied');
  }
  const beds = await bedService.getBedsByRoom(roomId);
  successResponse(res, beds, 'Beds fetched successfully');
}

export async function getBed(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const bed = await bedService.getBedById(req.params.id);
  if (bed.room.floor.property.organizationId !== orgId) {
    throw new ForbiddenError('Access denied');
  }
  successResponse(res, bed, 'Bed fetched successfully');
}

export async function updateBed(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const bed = await bedService.getBedById(req.params.id);
  if (bed.room.floor.property.organizationId !== orgId) {
    throw new ForbiddenError('Access denied');
  }
  const updated = await bedService.updateBed(req.params.id, req.body);
  successResponse(res, updated, 'Bed updated successfully');
}

export async function deleteBed(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const bed = await bedService.getBedById(req.params.id);
  if (bed.room.floor.property.organizationId !== orgId) {
    throw new ForbiddenError('Access denied');
  }
  await bedService.deleteBed(req.params.id);
  successResponse(res, null, 'Bed deleted successfully');
}
