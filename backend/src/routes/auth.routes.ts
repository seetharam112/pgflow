import { Router } from 'express';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import {
  register,
  login,
  refresh,
  me,
  logout,
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
router.get('/me', authenticateToken, asyncHandler(me));
router.post('/logout', authenticateToken, asyncHandler(logout));

export default router;

