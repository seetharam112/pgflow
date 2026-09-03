import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireOrganization } from '../middleware/role';
import { validate } from '../middleware/validate';
import { createRentSchema, updateRentSchema } from '../validators/rent.validator';
import * as controller from '../controllers/rent.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', authenticateToken, requireOrganization, validate(createRentSchema), asyncHandler(controller.createRent));
router.get('/', authenticateToken, requireOrganization, asyncHandler(controller.getRents));
router.get('/tenant/:tenantId', authenticateToken, requireOrganization, asyncHandler(controller.getTenantRents));
router.get('/:id', authenticateToken, requireOrganization, asyncHandler(controller.getRent));
router.put('/:id', authenticateToken, requireOrganization, validate(updateRentSchema), asyncHandler(controller.updateRent));
router.delete('/:id', authenticateToken, requireOrganization, asyncHandler(controller.deleteRent));

export default router;

