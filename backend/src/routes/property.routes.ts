import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireOrganization } from '../middleware/role';
import { validate } from '../middleware/validate';
import { createPropertySchema, updatePropertySchema } from '../validators/property.validator';
import * as controller from '../controllers/property.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', authenticateToken, requireOrganization, validate(createPropertySchema), asyncHandler(controller.createProperty));
router.get('/', authenticateToken, requireOrganization, asyncHandler(controller.getProperties));
router.get('/:id', authenticateToken, requireOrganization, asyncHandler(controller.getProperty));
router.put('/:id', authenticateToken, requireOrganization, validate(updatePropertySchema), asyncHandler(controller.updateProperty));
router.delete('/:id', authenticateToken, requireOrganization, asyncHandler(controller.deleteProperty));

export default router;

