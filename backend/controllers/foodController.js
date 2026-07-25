import Food from '../models/Food.js';
import Restaurant from '../models/Restaurant.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getFoods = asyncHandler(async (req, res) => {
  const { search, category, restaurant, isVeg, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
  const query = { isAvailable: true };

  if (search) query.$text = { $search: search };
  if (category) query.category = category;
  if (restaurant) query.restaurant = restaurant;
  if (isVeg !== undefined) query.isVeg = isVeg === 'true';
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'rating') sortOption = { rating: -1 };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [foods, total] = await Promise.all([
    Food.find(query)
      .populate('category', 'name slug')
      .populate('restaurant', 'name deliveryTime rating')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit)),
    Food.countDocuments(query),
  ]);

  res.json(new ApiResponse(200, { foods, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }));
});

export const getFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('restaurant', 'name deliveryTime rating deliveryFee minOrder');
  if (!food) throw new ApiError(404, 'Food item not found');
  res.json(new ApiResponse(200, food));
});

export const createFood = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.body.restaurant);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');

  if (req.user.role === 'restaurant' && restaurant.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to add food to this restaurant');
  }

  const food = await Food.create(req.body);
  res.status(201).json(new ApiResponse(201, food, 'Food item created'));
});

export const updateFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id).populate('restaurant');
  if (!food) throw new ApiError(404, 'Food item not found');

  if (req.user.role === 'restaurant' && food.restaurant.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  const updated = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json(new ApiResponse(200, updated, 'Food item updated'));
});

export const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id).populate('restaurant');
  if (!food) throw new ApiError(404, 'Food item not found');

  if (req.user.role === 'restaurant' && food.restaurant.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  await food.deleteOne();
  res.json(new ApiResponse(200, null, 'Food item deleted'));
});
