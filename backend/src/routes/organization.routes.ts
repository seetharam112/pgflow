import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireOrganization } from '../middleware/role';
import { validate } from '../middleware/validate';
import { inviteUserSchema, updateOrganizationSchema } from '../validators/organization.validator';
import * as controller from '../controllers/organization.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/me', authenticateToken, requireOrganization, asyncHandler(controller.getMyOrganization));
router.put('/me', authenticateToken, requireOrganization, validate(updateOrganizationSchema), asyncHandler(controller.updateOrganization));
router.post('/invite', authenticateToken, requireOrganization, validate(inviteUserSchema), asyncHandler(controller.inviteUser));
router.get('/users', authenticateToken, requireOrganization, asyncHandler(controller.getOrganizationUsers));

export default router;

