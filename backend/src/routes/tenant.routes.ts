import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireOrganization } from '../middleware/role';
import { validate } from '../middleware/validate';
import { createTenantSchema, updateTenantSchema } from '../validators/tenant.validator';
import * as controller from '../controllers/tenant.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', authenticateToken, requireOrganization, validate(createTenantSchema), asyncHandler(controller.createTenant));
router.get('/', authenticateToken, requireOrganization, asyncHandler(controller.getTenants));
router.get('/:id', authenticateToken, requireOrganization, asyncHandler(controller.getTenant));
router.put('/:id', authenticateToken, requireOrganization, validate(updateTenantSchema), asyncHandler(controller.updateTenant));
router.delete('/:id', authenticateToken, requireOrganization, asyncHandler(controller.deleteTenant));

export default router;

