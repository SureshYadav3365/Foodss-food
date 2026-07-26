import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api';

const getErrorMessage = (err, fallback) => {
  const errorData = err.response?.data;
  if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
    return errorData.errors.join(', ');
  }
  return errorData?.message || err.message || fallback;
};

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Login failed'));
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Registration failed'));
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.getMe();
    localStorage.setItem('user', JSON.stringify(data.data));
    return data.data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Failed to fetch user'));
  }
});

const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
if (storedUser && storedUser.email) {
  const savedAvatar = localStorage.getItem(`userAvatar_${storedUser.email}`) || localStorage.getItem('userAvatar');
  if (savedAvatar) {
    storedUser.avatar = savedAvatar;
    localStorage.setItem(`userAvatar_${storedUser.email}`, savedAvatar);
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userAvatar');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      const email = state.user?.email || action.payload?.email;
      if (email) {
        if (action.payload.avatar) {
          localStorage.setItem(`userAvatar_${email}`, action.payload.avatar);
        } else if (action.payload.avatar === null) {
          localStorage.removeItem(`userAvatar_${email}`);
        }
      }
      state.user = { ...state.user, ...action.payload };
      if (state.user && email) {
        const savedAvatar = localStorage.getItem(`userAvatar_${email}`);
        if (savedAvatar) {
          state.user.avatar = savedAvatar;
        } else if (action.payload.avatar === null) {
          state.user.avatar = null;
        }
      }
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (state.user && state.user.email) {
          const savedAvatar = localStorage.getItem(`userAvatar_${state.user.email}`) || localStorage.getItem('userAvatar');
          if (savedAvatar) {
            state.user.avatar = savedAvatar;
          }
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (state.user && state.user.email) {
          const savedAvatar = localStorage.getItem(`userAvatar_${state.user.email}`) || localStorage.getItem('userAvatar');
          if (savedAvatar) {
            state.user.avatar = savedAvatar;
          }
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(fetchMe.fulfilled, (state, action) => { 
        state.user = action.payload; 
        if (state.user && state.user.email) {
          const savedAvatar = localStorage.getItem(`userAvatar_${state.user.email}`) || localStorage.getItem('userAvatar');
          if (savedAvatar) {
            state.user.avatar = savedAvatar;
          }
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userAvatar');
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
