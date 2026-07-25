import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getMe,
  updateProfile,
  updateAddresses,
  getAllUsers,
  refreshToken,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post('/refresh', refreshToken);

router.post(
  '/forgotpassword',
  [body('email').isEmail().withMessage('Valid email is required')],
  validate,
  forgotPassword
);

router.put(
  '/resetpassword/:resettoken',
  [body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')],
  validate,
  resetPassword
);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/addresses', protect, updateAddresses);
router.get('/users', protect, authorize('admin'), getAllUsers);

export default router;
