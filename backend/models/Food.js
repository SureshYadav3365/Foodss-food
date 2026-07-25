import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null },
    image: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    calories: { type: Number, default: null },
    tags: [{ type: String }],
    spiceLevel: { type: String, enum: ['mild', 'medium', 'hot'], default: 'mild' },
  },
  { timestamps: true }
);

foodSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Food = mongoose.model('Food', foodSchema);
export default Food;
