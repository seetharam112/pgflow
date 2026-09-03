import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireOrganization } from '../middleware/role';
import { validate } from '../middleware/validate';
import { moveInSchema } from '../validators/assignment.validator';
import * as controller from '../controllers/bedAssignment.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/move-in', authenticateToken, requireOrganization, validate(moveInSchema), asyncHandler(controller.moveIn));
router.post('/:id/move-out', authenticateToken, requireOrganization, asyncHandler(controller.moveOut));
router.get('/tenant/:tenantId', authenticateToken, requireOrganization, asyncHandler(controller.getAssignmentsByTenant));
router.get('/active', authenticateToken, requireOrganization, asyncHandler(controller.getActiveAssignments));

export default router;

