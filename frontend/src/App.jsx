import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/common/SplashScreen';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import FoodDetail from './pages/FoodDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import Offers from './pages/Offers';
import AdminDashboard from './pages/admin/AdminDashboard';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import { fetchMe } from './store/slices/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMe());
    }
  }, [token, user, dispatch]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '16px',
            background: '#1e293b',
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            padding: '12px 24px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          },
          success: {
            style: {
              background: '#10b981', // Emerald green
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444', // Red
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
        <Route path="/food/:id" element={<FoodDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderTracking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
      </Routes>
    </>
  );
};

export default App;
