import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    cuisine: [{ type: String }],
    image: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    deliveryTime: { type: String, default: '30-40 mins' },
    deliveryFee: { type: Number, default: 40 },
    minOrder: { type: Number, default: 99 },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

restaurantSchema.index({ name: 'text', cuisine: 'text', city: 'text' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
