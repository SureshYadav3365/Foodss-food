import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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

const App = () => (
  <>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { borderRadius: '12px', background: '#1e293b', color: '#fff' },
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

export default App;
