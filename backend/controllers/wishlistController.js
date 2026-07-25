import Wishlist from '../models/Wishlist.js';
import Food from '../models/Food.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: 'foods',
    populate: { path: 'restaurant', select: 'name' },
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, foods: [] });
  }

  res.json(new ApiResponse(200, wishlist.foods));
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.foodId);
  if (!food) throw new ApiError(404, 'Food not found');

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, foods: [food._id] });
  } else {
    if (wishlist.foods.includes(food._id)) {
      throw new ApiError(400, 'Already in wishlist');
    }
    wishlist.foods.push(food._id);
    await wishlist.save();
  }

  const populated = await Wishlist.findById(wishlist._id).populate({
    path: 'foods',
    populate: { path: 'restaurant', select: 'name' },
  });

  res.json(new ApiResponse(200, populated.foods, 'Added to wishlist'));
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) throw new ApiError(404, 'Wishlist not found');

  wishlist.foods = wishlist.foods.filter((id) => id.toString() !== req.params.foodId);
  await wishlist.save();

  const populated = await Wishlist.findById(wishlist._id).populate({
    path: 'foods',
    populate: { path: 'restaurant', select: 'name' },
  });

  res.json(new ApiResponse(200, populated.foods, 'Removed from wishlist'));
});
