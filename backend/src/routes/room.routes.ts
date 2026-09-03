import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireOrganization } from '../middleware/role';
import { validate } from '../middleware/validate';
import { createRoomSchema, updateRoomSchema } from '../validators/room.validator';
import * as controller from '../controllers/room.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', authenticateToken, requireOrganization, validate(createRoomSchema), asyncHandler(controller.createRoom));
router.get('/', authenticateToken, requireOrganization, asyncHandler(controller.getRooms));
router.get('/:id', authenticateToken, requireOrganization, asyncHandler(controller.getRoom));
router.put('/:id', authenticateToken, requireOrganization, validate(updateRoomSchema), asyncHandler(controller.updateRoom));
router.delete('/:id', authenticateToken, requireOrganization, asyncHandler(controller.deleteRoom));

export default router;

