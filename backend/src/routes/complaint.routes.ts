import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireOrganization } from '../middleware/role';
import { validate } from '../middleware/validate';
import { createComplaintSchema, updateComplaintSchema } from '../validators/complaint.validator';
import * as controller from '../controllers/complaint.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', authenticateToken, requireOrganization, validate(createComplaintSchema), asyncHandler(controller.createComplaint));
router.get('/', authenticateToken, requireOrganization, asyncHandler(controller.getComplaints));
router.get('/my', authenticateToken, asyncHandler(controller.getMyComplaints));
router.get('/:id', authenticateToken, requireOrganization, asyncHandler(controller.getComplaint));
router.put('/:id', authenticateToken, requireOrganization, validate(updateComplaintSchema), asyncHandler(controller.updateComplaint));
router.delete('/:id', authenticateToken, requireOrganization, asyncHandler(controller.deleteComplaint));

export default router;

