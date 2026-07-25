import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', maxlength: 500 },
  },
  { timestamps: true }
);

reviewSchema.index({ restaurant: 1, user: 1 });
reviewSchema.index({ food: 1, user: 1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
