import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireOrganization } from '../middleware/role';
import { validate } from '../middleware/validate';
import { createFloorSchema, updateFloorSchema } from '../validators/floor.validator';
import * as controller from '../controllers/floor.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', authenticateToken, requireOrganization, validate(createFloorSchema), asyncHandler(controller.createFloor));
router.get('/', authenticateToken, requireOrganization, asyncHandler(controller.getFloors));
router.get('/:id', authenticateToken, requireOrganization, asyncHandler(controller.getFloor));
router.put('/:id', authenticateToken, requireOrganization, validate(updateFloorSchema), asyncHandler(controller.updateFloor));
router.delete('/:id', authenticateToken, requireOrganization, asyncHandler(controller.deleteFloor));

export default router;

