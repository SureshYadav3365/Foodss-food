import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats,
  payOrder,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/stats', protect, authorize('admin', 'restaurant'), getOrderStats);
router.get('/:id', protect, getOrder);
router.put('/:id/pay', protect, payOrder);
router.put('/:id/status', protect, authorize('admin', 'restaurant'), updateOrderStatus);

export default router;
