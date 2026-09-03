import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireOrganization } from '../middleware/role';
import { validate } from '../middleware/validate';
import { createPaymentSchema, updatePaymentSchema } from '../validators/payment.validator';
import * as controller from '../controllers/payment.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', authenticateToken, requireOrganization, validate(createPaymentSchema), asyncHandler(controller.createPayment));
router.get('/', authenticateToken, requireOrganization, asyncHandler(controller.getPayments));
router.get('/rent/:rentId', authenticateToken, requireOrganization, asyncHandler(controller.getPaymentsByRent));
router.get('/:id', authenticateToken, requireOrganization, asyncHandler(controller.getPayment));
router.put('/:id', authenticateToken, requireOrganization, validate(updatePaymentSchema), asyncHandler(controller.updatePayment));
router.delete('/:id', authenticateToken, requireOrganization, asyncHandler(controller.deletePayment));

export default router;

