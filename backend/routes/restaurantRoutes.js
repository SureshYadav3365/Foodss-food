import { Router } from 'express';
import {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurant,
  getStats,
} from '../controllers/restaurantController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getRestaurants);
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/my', protect, authorize('restaurant'), getMyRestaurant);
router.get('/:id', getRestaurant);
router.post('/', protect, authorize('admin', 'restaurant'), createRestaurant);
router.put('/:id', protect, authorize('admin', 'restaurant'), updateRestaurant);
router.delete('/:id', protect, authorize('admin'), deleteRestaurant);

export default router;
