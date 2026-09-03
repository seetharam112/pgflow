import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/response';
import * as roomService from '../services/room.service';
import * as floorService from '../services/floor.service';
import { ForbiddenError, BadRequestError } from '../utils/errors';

export async function createRoom(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const floor = await floorService.getFloorById(req.body.floorId);
  if (floor.property.organizationId !== orgId) {
    throw new ForbiddenError('Access denied');
  }
  const room = await roomService.createRoom(req.body);
  successResponse(res, room, 'Room created successfully', 201);
}

export async function getRooms(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const floorId = req.query.floorId as string;
  if (!floorId) throw new BadRequestError('floorId query parameter is required');
  const floor = await floorService.getFloorById(floorId);
  if (floor.property.organizationId !== orgId) {
    throw new ForbiddenError('Access denied');
  }
  const rooms = await roomService.getRoomsByFloor(floorId);
  successResponse(res, rooms, 'Rooms fetched successfully');
}

export async function getRoom(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const room = await roomService.getRoomById(req.params.id);
  if (room.floor.property.organizationId !== orgId) {
    throw new ForbiddenError('Access denied');
  }
  successResponse(res, room, 'Room fetched successfully');
}

export async function updateRoom(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const room = await roomService.getRoomById(req.params.id);
  if (room.floor.property.organizationId !== orgId) {
    throw new ForbiddenError('Access denied');
  }
  const updated = await roomService.updateRoom(req.params.id, req.body);
  successResponse(res, updated, 'Room updated successfully');
}

export async function deleteRoom(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const room = await roomService.getRoomById(req.params.id);
  if (room.floor.property.organizationId !== orgId) {
    throw new ForbiddenError('Access denied');
  }
  await roomService.deleteRoom(req.params.id);
  successResponse(res, null, 'Room deleted successfully');
}
