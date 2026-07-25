import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getRestaurants = asyncHandler(async (req, res) => {
  const { search, cuisine, city, sort, featured, page = 1, limit = 12 } = req.query;
  const query = { isActive: true };

  if (search) {
    query.$text = { $search: search };
  }
  if (cuisine) {
    query.cuisine = { $in: cuisine.split(',') };
  }
  if (city) {
    query.city = new RegExp(city, 'i');
  }
  if (featured === 'true') {
    query.isFeatured = true;
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'rating') sortOption = { rating: -1 };
  if (sort === 'delivery') sortOption = { deliveryTime: 1 };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [restaurants, total] = await Promise.all([
    Restaurant.find(query).sort(sortOption).skip(skip).limit(parseInt(limit)).populate('owner', 'name email'),
    Restaurant.countDocuments(query),
  ]);

  res.json(new ApiResponse(200, { restaurants, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }));
});

export const getRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email phone');
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');
  res.json(new ApiResponse(200, restaurant));
});

export const createRestaurant = asyncHandler(async (req, res) => {
  const data = { ...req.body, owner: req.user.role === 'restaurant' ? req.user._id : req.body.owner || req.user._id };
  const restaurant = await Restaurant.create(data);
  res.status(201).json(new ApiResponse(201, restaurant, 'Restaurant created'));
});

export const updateRestaurant = asyncHandler(async (req, res) => {
  let restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');

  if (req.user.role === 'restaurant' && restaurant.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this restaurant');
  }

  restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json(new ApiResponse(200, restaurant, 'Restaurant updated'));
});

export const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');

  await Food.deleteMany({ restaurant: restaurant._id });
  await restaurant.deleteOne();
  res.json(new ApiResponse(200, null, 'Restaurant deleted'));
});

export const getMyRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ owner: req.user._id });
  if (!restaurant) throw new ApiError(404, 'No restaurant found for this account');
  res.json(new ApiResponse(200, restaurant));
});

export const getStats = asyncHandler(async (req, res) => {
  const [totalRestaurants, totalFoods, activeRestaurants] = await Promise.all([
    Restaurant.countDocuments(),
    Food.countDocuments(),
    Restaurant.countDocuments({ isActive: true }),
  ]);
  res.json(new ApiResponse(200, { totalRestaurants, totalFoods, activeRestaurants }));
});
