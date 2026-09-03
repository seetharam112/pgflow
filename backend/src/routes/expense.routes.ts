import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireOrganization } from '../middleware/role';
import { validate } from '../middleware/validate';
import { createExpenseSchema, updateExpenseSchema } from '../validators/expense.validator';
import * as controller from '../controllers/expense.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', authenticateToken, requireOrganization, validate(createExpenseSchema), asyncHandler(controller.createExpense));
router.get('/', authenticateToken, requireOrganization, asyncHandler(controller.getExpenses));
router.get('/:id', authenticateToken, requireOrganization, asyncHandler(controller.getExpense));
router.put('/:id', authenticateToken, requireOrganization, validate(updateExpenseSchema), asyncHandler(controller.updateExpense));
router.delete('/:id', authenticateToken, requireOrganization, asyncHandler(controller.deleteExpense));

export default router;

