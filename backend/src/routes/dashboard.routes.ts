import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireOrganization } from '../middleware/role';
import * as controller from '../controllers/dashboard.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/stats', authenticateToken, requireOrganization, asyncHandler(controller.getDashboardStats));
router.get('/occupancy', authenticateToken, requireOrganization, asyncHandler(controller.getOccupancyBreakdown));

export default router;

