import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart') || '{"items":[],"restaurantId":null}');
  } catch {
    return { items: [], restaurantId: null };
  }
};

const saveCart = (state) => {
  localStorage.setItem('cart', JSON.stringify({ items: state.items, restaurantId: state.restaurantId }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart().items,
    restaurantId: loadCart().restaurantId,
    coupon: null,
    discount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { food, quantity = 1 } = action.payload;
      const restaurantId = food.restaurant?._id || food.restaurant;

      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
      }
      state.restaurantId = restaurantId;

      const existing = state.items.find((item) => item.food._id === food._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ food, quantity });
      }
      saveCart(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.food._id !== action.payload);
      if (state.items.length === 0) state.restaurantId = null;
      saveCart(state);
    },
    updateQuantity: (state, action) => {
      const { foodId, quantity } = action.payload;
      const item = state.items.find((i) => i.food._id === foodId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.food._id !== foodId);
        } else {
          item.quantity = quantity;
        }
      }
      if (state.items.length === 0) state.restaurantId = null;
      saveCart(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.coupon = null;
      state.discount = 0;
      saveCart(state);
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload.coupon;
      state.discount = action.payload.discount;
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + (i.food.discountPrice || i.food.price) * i.quantity, 0);

export default cartSlice.reducer;
