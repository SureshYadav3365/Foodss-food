import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistAPI } from '../../api';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await wishlistAPI.getAll();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async ({ foodId, isInWishlist }, { rejectWithValue }) => {
  try {
    if (isInWishlist) {
      const { data } = await wishlistAPI.remove(foodId);
      return data.data;
    }
    const { data } = await wishlistAPI.add(foodId);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchWishlist.rejected, (state) => { state.loading = false; })
      .addCase(toggleWishlist.fulfilled, (state, action) => { state.items = action.payload; });
  },
});

export const selectIsInWishlist = (foodId) => (state) =>
  state.wishlist.items.some((f) => f._id === foodId);

export default wishlistSlice.reducer;
