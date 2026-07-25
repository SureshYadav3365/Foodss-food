import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const updateAverageRating = async (Model, id, field) => {
  const reviews = await Review.find({ [field]: id });
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  await Model.findByIdAndUpdate(id, { rating: Math.round(avg * 10) / 10, reviewCount: reviews.length });
};

export const getReviews = asyncHandler(async (req, res) => {
  const { restaurant, food } = req.query;
  const query = {};
  if (restaurant) query.restaurant = restaurant;
  if (food) query.food = food;

  const reviews = await Review.find(query)
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, reviews));
});

export const createReview = asyncHandler(async (req, res) => {
  const { restaurant, food, rating, comment } = req.body;

  if (!restaurant && !food) throw new ApiError(400, 'Restaurant or food is required');

  const existingQuery = { user: req.user._id };
  if (restaurant) existingQuery.restaurant = restaurant;
  if (food) existingQuery.food = food;

  const existing = await Review.findOne(existingQuery);
  if (existing) throw new ApiError(400, 'You have already reviewed this item');

  const review = await Review.create({
    user: req.user._id,
    restaurant,
    food,
    rating,
    comment,
  });

  if (restaurant) await updateAverageRating(Restaurant, restaurant, 'restaurant');
  if (food) await updateAverageRating(Food, food, 'food');

  const populated = await Review.findById(review._id).populate('user', 'name avatar');
  res.status(201).json(new ApiResponse(201, populated, 'Review submitted'));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  const { restaurant, food } = review;
  await review.deleteOne();

  if (restaurant) await updateAverageRating(Restaurant, restaurant, 'restaurant');
  if (food) await updateAverageRating(Food, food, 'food');

  res.json(new ApiResponse(200, null, 'Review deleted'));
});
