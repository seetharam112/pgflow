import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireOrganization } from '../middleware/role';
import { validate } from '../middleware/validate';
import { createBedSchema, updateBedSchema } from '../validators/bed.validator';
import * as controller from '../controllers/bed.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', authenticateToken, requireOrganization, validate(createBedSchema), asyncHandler(controller.createBed));
router.get('/', authenticateToken, requireOrganization, asyncHandler(controller.getBeds));
router.get('/:id', authenticateToken, requireOrganization, asyncHandler(controller.getBed));
router.put('/:id', authenticateToken, requireOrganization, validate(updateBedSchema), asyncHandler(controller.updateBed));
router.delete('/:id', authenticateToken, requireOrganization, asyncHandler(controller.deleteBed));

export default router;

