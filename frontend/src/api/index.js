import API from './axios';

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  updateAddresses: (data) => API.put('/auth/addresses', data),
  getUsers: () => API.get('/auth/users'),
  forgotPassword: (data) => API.post('/auth/forgotpassword', data),
  resetPassword: (resetToken, data) => API.put(`/auth/resetpassword/${resetToken}`, data),
};

export const restaurantAPI = {
  getAll: (params) => API.get('/restaurants', { params }),
  getById: (id) => API.get(`/restaurants/${id}`),
  create: (data) => API.post('/restaurants', data),
  update: (id, data) => API.put(`/restaurants/${id}`, data),
  delete: (id) => API.delete(`/restaurants/${id}`),
  getMy: () => API.get('/restaurants/my'),
  getStats: () => API.get('/restaurants/stats'),
};

export const foodAPI = {
  getAll: (params) => API.get('/foods', { params }),
  getById: (id) => API.get(`/foods/${id}`),
  create: (data) => API.post('/foods', data),
  update: (id, data) => API.put(`/foods/${id}`, data),
  delete: (id) => API.delete(`/foods/${id}`),
};

export const categoryAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getAll: () => API.get('/orders'),
  getById: (id) => API.get(`/orders/${id}`),
  pay: (id) => API.put(`/orders/${id}/pay`),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
  getStats: () => API.get('/orders/stats'),
};

export const reviewAPI = {
  getAll: (params) => API.get('/reviews', { params }),
  create: (data) => API.post('/reviews', data),
  delete: (id) => API.delete(`/reviews/${id}`),
};

export const couponAPI = {
  getAll: () => API.get('/coupons'),
  validate: (code, orderAmount) => API.get(`/coupons/validate/${code}`, { params: { orderAmount } }),
  create: (data) => API.post('/coupons', data),
  update: (id, data) => API.put(`/coupons/${id}`, data),
  delete: (id) => API.delete(`/coupons/${id}`),
};

export const wishlistAPI = {
  getAll: () => API.get('/wishlist'),
  add: (foodId) => API.post(`/wishlist/${foodId}`),
  remove: (foodId) => API.delete(`/wishlist/${foodId}`),
};

export const cartAPI = {
  get: () => API.get('/cart'),
  add: (data) => API.post('/cart/add', data),
  update: (data) => API.put('/cart/update', data),
  remove: (foodId) => API.delete(`/cart/remove/${foodId}`),
  clear: () => API.delete('/cart/clear'),
};

export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  markRead: (id) => API.put(`/notifications/${id}/read`),
  markAllRead: () => API.put('/notifications/read-all'),
};

export const uploadAPI = {
  uploadImage: (formData, folder = 'general') =>
    API.post(`/upload?folder=${folder}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};
