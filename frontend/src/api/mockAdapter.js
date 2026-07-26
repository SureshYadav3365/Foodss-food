import { mockRestaurants, mockCategories, mockFoods, mockCoupons } from './mockData';

// Helper to get from localStorage or default
const getStorageItem = (key, defaultValue) => {
  const val = localStorage.getItem(key);
  if (!val) return defaultValue;
  try {
    return JSON.parse(val);
  } catch (e) {
    return defaultValue;
  }
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initial setup of users in localStorage if not exists
const initMockDB = () => {
  const users = getStorageItem('demo_users', []);
  if (users.length === 0) {
    const defaultUsers = [
      { _id: 'usr_admin', name: 'Admin User', email: 'admin@fooddelivery.com', password: 'admin123', role: 'admin', phone: '9999999999', addresses: [] },
      { _id: 'usr_owner', name: 'Raj Restaurant', email: 'restaurant@fooddelivery.com', password: 'restaurant123', role: 'restaurant', phone: '8888888888', addresses: [] },
      { _id: 'usr_customer', name: 'John Doe', email: 'user@fooddelivery.com', password: 'user123', role: 'user', phone: '9876543210', addresses: [{ label: 'Home', street: '123 Main Street', city: 'Nagal Koju', state: 'Rajasthan', pincode: '303007', isDefault: true }] }
    ];
    setStorageItem('demo_users', defaultUsers);
  }
};

initMockDB();

export const mockRequestAdapter = (config) => {
  return new Promise((resolve, reject) => {
    const { url, method, data: dataStr } = config;
    const data = dataStr ? (typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr) : null;
    
    // Normalize url: remove baseURL if present, remove query params for path matching
    let path = url;
    if (path.startsWith('http')) {
      const urlObj = new URL(path);
      path = urlObj.pathname;
    }
    const cleanPath = path.replace(/^\/api/, '');
    
    console.log(`[Mock API] Intercepted: ${method.toUpperCase()} ${cleanPath}`, data);

    const currentUser = getStorageItem('user', null);

    // Helpers to build response
    const successResponse = (resData) => {
      resolve({
        data: { success: true, data: resData },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      });
    };

    const errorResponse = (message, status = 400) => {
      reject({
        response: {
          status,
          data: { success: false, message: message }
        },
        message: message
      });
    };

    // Route matching
    // 1. Auth routes
    if (cleanPath === '/auth/register' && method.toLowerCase() === 'post') {
      const { name, email, password, role, phone } = data;
      if (!name || !email || !password) {
        return errorResponse('Name, email, and password are required');
      }
      const users = getStorageItem('demo_users', []);
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return errorResponse('User already exists with this email');
      }
      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password,
        role: role || 'user',
        phone: phone || '',
        addresses: []
      };
      users.push(newUser);
      setStorageItem('demo_users', users);
      
      const token = 'dummy-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      return successResponse({ token, user: newUser });
    }

    if (cleanPath === '/auth/login' && method.toLowerCase() === 'post') {
      const { email, password } = data;
      if (!email || !password) {
        return errorResponse('Email and password are required');
      }
      const users = getStorageItem('demo_users', []);
      const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!matched) {
        return errorResponse('Invalid email or password');
      }
      const token = 'dummy-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(matched));
      return successResponse({ token, user: matched });
    }

    if (cleanPath === '/auth/me' && method.toLowerCase() === 'get') {
      if (!currentUser) return errorResponse('Not authenticated', 401);
      return successResponse(currentUser);
    }

    if (cleanPath === '/auth/profile' && method.toLowerCase() === 'put') {
      if (!currentUser) return errorResponse('Not authenticated', 401);
      const updated = { ...currentUser, ...data };
      localStorage.setItem('user', JSON.stringify(updated));
      
      // Update in demo_users list
      const users = getStorageItem('demo_users', []);
      const idx = users.findIndex(u => u._id === currentUser._id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        setStorageItem('demo_users', users);
      }
      return successResponse(updated);
    }

    if (cleanPath === '/auth/addresses' && method.toLowerCase() === 'put') {
      if (!currentUser) return errorResponse('Not authenticated', 401);
      const updated = { ...currentUser, addresses: data };
      localStorage.setItem('user', JSON.stringify(updated));
      
      const users = getStorageItem('demo_users', []);
      const idx = users.findIndex(u => u._id === currentUser._id);
      if (idx !== -1) {
        users[idx] = updated;
        setStorageItem('demo_users', users);
      }
      return successResponse(updated);
    }

    // 2. Restaurants routes
    if (cleanPath.startsWith('/restaurants') && method.toLowerCase() === 'get') {
      const idMatch = cleanPath.match(/^\/restaurants\/([a-zA-Z0-9_]+)$/);
      if (idMatch) {
        const id = idMatch[1];
        if (id === 'my') {
          const myRest = mockRestaurants.filter(r => r.owner === currentUser?._id);
          return successResponse({ restaurants: myRest });
        }
        if (id === 'stats') {
          return successResponse({ totalOrders: 15, totalRevenue: 4500, averageRating: 4.5 });
        }
        const rest = mockRestaurants.find(r => r._id === id);
        if (!rest) return errorResponse('Restaurant not found', 404);
        return successResponse(rest);
      }
      return successResponse({ restaurants: mockRestaurants });
    }

    // 3. Category routes
    if (cleanPath === '/categories' && method.toLowerCase() === 'get') {
      return successResponse(mockCategories);
    }

    // 4. Foods routes
    if (cleanPath.startsWith('/foods') && method.toLowerCase() === 'get') {
      const idMatch = cleanPath.match(/^\/foods\/([a-zA-Z0-9_]+)$/);
      if (idMatch) {
        const id = idMatch[1];
        const food = mockFoods.find(f => f._id === id);
        if (!food) return errorResponse('Food not found', 404);
        return successResponse(food);
      }
      return successResponse({ foods: mockFoods });
    }

    // 5. Coupons routes
    if (cleanPath === '/coupons' && method.toLowerCase() === 'get') {
      return successResponse(mockCoupons);
    }

    if (cleanPath.startsWith('/coupons/validate/')) {
      const parts = cleanPath.split('/');
      const code = parts[parts.length - 1];
      const coupon = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
      if (!coupon) return errorResponse('Invalid coupon code');
      return successResponse(coupon);
    }

    // 6. Wishlist routes
    if (cleanPath === '/wishlist' && method.toLowerCase() === 'get') {
      if (!currentUser) return errorResponse('Not authenticated', 401);
      const wishlist = getStorageItem(`wishlist_${currentUser._id}`, []);
      const wishlistedFoods = mockFoods.filter(f => wishlist.includes(f._id));
      return successResponse(wishlistedFoods);
    }

    if (cleanPath.startsWith('/wishlist/') && method.toLowerCase() === 'post') {
      if (!currentUser) return errorResponse('Not authenticated', 401);
      const foodId = cleanPath.substring('/wishlist/'.length);
      const wishlist = getStorageItem(`wishlist_${currentUser._id}`, []);
      if (!wishlist.includes(foodId)) {
        wishlist.push(foodId);
        setStorageItem(`wishlist_${currentUser._id}`, wishlist);
      }
      return successResponse({ message: 'Added to wishlist' });
    }

    if (cleanPath.startsWith('/wishlist/') && method.toLowerCase() === 'delete') {
      if (!currentUser) return errorResponse('Not authenticated', 401);
      const foodId = cleanPath.substring('/wishlist/'.length);
      let wishlist = getStorageItem(`wishlist_${currentUser._id}`, []);
      wishlist = wishlist.filter(id => id !== foodId);
      setStorageItem(`wishlist_${currentUser._id}`, wishlist);
      return successResponse({ message: 'Removed from wishlist' });
    }

    // 7. Cart routes
    if (cleanPath === '/cart' && method.toLowerCase() === 'get') {
      if (!currentUser) return errorResponse('Not authenticated', 401);
      const cart = getStorageItem(`cart_${currentUser._id}`, { items: [], totalAmount: 0 });
      return successResponse(cart);
    }

    if (cleanPath === '/cart/add' && method.toLowerCase() === 'post') {
      if (!currentUser) return errorResponse('Not authenticated', 401);
      const { foodId, quantity } = data;
      const cart = getStorageItem(`cart_${currentUser._id}`, { items: [], totalAmount: 0 });
      const foodItem = mockFoods.find(f => f._id === foodId);
      if (!foodItem) return errorResponse('Food item not found', 404);
      
      const existing = cart.items.find(item => item.food._id === foodId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({ food: foodItem, quantity });
      }
      cart.totalAmount = cart.items.reduce((acc, curr) => acc + (curr.food.discountPrice || curr.food.price) * curr.quantity, 0);
      setStorageItem(`cart_${currentUser._id}`, cart);
      return successResponse(cart);
    }

    if (cleanPath === '/cart/update' && method.toLowerCase() === 'put') {
      if (!currentUser) return errorResponse('Not authenticated', 401);
      const { foodId, quantity } = data;
      const cart = getStorageItem(`cart_${currentUser._id}`, { items: [], totalAmount: 0 });
      const existing = cart.items.find(item => item.food._id === foodId);
      if (existing) {
        existing.quantity = quantity;
        if (existing.quantity <= 0) {
          cart.items = cart.items.filter(item => item.food._id !== foodId);
        }
      }
      cart.totalAmount = cart.items.reduce((acc, curr) => acc + (curr.food.discountPrice || curr.food.price) * curr.quantity, 0);
      setStorageItem(`cart_${currentUser._id}`, cart);
      return successResponse(cart);
    }

    if (cleanPath.startsWith('/cart/remove/') && method.toLowerCase() === 'delete') {
      if (!currentUser) return errorResponse('Not authenticated', 401);
      const foodId = cleanPath.substring('/cart/remove/'.length);
      const cart = getStorageItem(`cart_${currentUser._id}`, { items: [], totalAmount: 0 });
      cart.items = cart.items.filter(item => item.food._id !== foodId);
      cart.totalAmount = cart.items.reduce((acc, curr) => acc + (curr.food.discountPrice || curr.food.price) * curr.quantity, 0);
      setStorageItem(`cart_${currentUser._id}`, cart);
      return successResponse(cart);
    }

    if (cleanPath === '/cart/clear' && method.toLowerCase() === 'delete') {
      if (!currentUser) return errorResponse('Not authenticated', 401);
      const emptyCart = { items: [], totalAmount: 0 };
      setStorageItem(`cart_${currentUser._id}`, emptyCart);
      return successResponse(emptyCart);
    }

    // 8. Orders routes
    if (cleanPath === '/orders' && method.toLowerCase() === 'post') {
      if (!currentUser) return errorResponse('Not authenticated', 401);
      
      const orderItems = (data.items || []).map(item => {
        const food = mockFoods.find(f => f._id === item.food);
        return {
          food: food?._id || item.food,
          name: food?.name || 'Food Item',
          price: food ? (food.discountPrice || food.price) : 0,
          quantity: item.quantity,
          image: food?.image || ''
        };
      });
      
      const subtotal = orderItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
      const deliveryFee = 40;
      const discount = 0; 
      const total = subtotal + deliveryFee - discount;

      const restId = orderItems[0]?.food ? (mockFoods.find(f => f._id === orderItems[0].food)?.restaurant || 'rest_1') : 'rest_1';
      const matchedRestaurant = mockRestaurants.find(r => r._id === restId);
      const restaurantObj = matchedRestaurant 
        ? { _id: matchedRestaurant._id, name: matchedRestaurant.name, image: matchedRestaurant.image } 
        : { _id: 'rest_1', name: 'Pizza Palace', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' };

      const order = {
        _id: 'ord_' + Date.now(),
        user: currentUser._id,
        restaurant: restaurantObj,
        items: orderItems,
        deliveryAddress: data.deliveryAddress || {},
        paymentMethod: data.paymentMethod || 'cod',
        subtotal,
        deliveryFee,
        discount,
        total,
        status: 'placed',
        createdAt: new Date().toISOString(),
        paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'paid',
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        statusHistory: [
          { status: 'placed', timestamp: new Date().toISOString(), note: 'Order placed successfully' }
        ]
      };
      
      const orders = getStorageItem(`orders_${currentUser._id}`, []);
      orders.unshift(order);
      setStorageItem(`orders_${currentUser._id}`, orders);
      
      const emptyCart = { items: [], totalAmount: 0 };
      setStorageItem(`cart_${currentUser._id}`, emptyCart);
      
      return successResponse(order);
    }

    if (cleanPath === '/orders' && method.toLowerCase() === 'get') {
      if (!currentUser) return errorResponse('Not authenticated', 401);
      const orders = getStorageItem(`orders_${currentUser._id}`, []);
      return successResponse(orders);
    }

    if (cleanPath.startsWith('/orders/')) {
      const idMatch = cleanPath.match(/^\/orders\/([a-zA-Z0-9_]+)$/);
      if (idMatch) {
        const id = idMatch[1];
        if (id === 'stats') {
          return successResponse({
            totalOrders: 10,
            totalRevenue: 3200,
            stats: [
              { _id: 'placed', count: 2, revenue: 600 },
              { _id: 'confirmed', count: 1, revenue: 400 },
              { _id: 'preparing', count: 2, revenue: 700 },
              { _id: 'out_for_delivery', count: 1, revenue: 300 },
              { _id: 'delivered', count: 4, revenue: 1200 }
            ]
          });
        }
        const orders = getStorageItem(`orders_${currentUser?._id}`, []);
        const order = orders.find(o => o._id === id);
        if (!order) return errorResponse('Order not found', 404);
        return successResponse(order);
      }
    }

    // 9. Catch-alls
    if (cleanPath === '/notifications') {
      return successResponse([]);
    }
    
    return successResponse({});
  });
};
