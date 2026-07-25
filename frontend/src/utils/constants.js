export const ORDER_STATUS = {
  placed: { label: 'Order Placed', color: 'bg-blue-100 text-blue-700', step: 0 },
  confirmed: { label: 'Confirmed', color: 'bg-indigo-100 text-indigo-700', step: 1 },
  preparing: { label: 'Preparing', color: 'bg-yellow-100 text-yellow-700', step: 2 },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700', step: 3 },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', step: 4 },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', step: -1 },
};

export const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI Payment', icon: '📱' },
  { id: 'wallet', label: 'Wallet', icon: '👛' },
];

export const CUISINES = ['Italian', 'Indian', 'Chinese', 'American', 'Mexican', 'Thai', 'Japanese', 'Fast Food', 'Biryani', 'Pizza', 'Burger', 'Desserts'];

export const formatPrice = (price) => `₹${price?.toFixed(0) || 0}`;

export const getEffectivePrice = (food) => food?.discountPrice || food?.price || 0;

export const FOOD_IMAGES = {
  default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
};
