import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: '' },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    paymentMethod: { type: String, enum: ['cod', 'card', 'upi', 'wallet'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    deliveryAddress: {
      label: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    estimatedDelivery: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

orderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.statusHistory = [{ status: 'placed', timestamp: new Date(), note: 'Order placed successfully' }];
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
