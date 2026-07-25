import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { IoSearch, IoCart, IoHeart, IoPerson, IoMenu, IoLogOut } from 'react-icons/io5';
import { HiLocationMarker } from 'react-icons/hi';
import { logout } from '../../store/slices/authSlice';
import { selectCartCount } from '../../store/slices/cartSlice';
import { setSearchQuery, toggleTheme } from '../../store/slices/uiSlice';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(search));
    navigate(`/restaurants?search=${search}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🍔</span>
            <span className="font-display font-bold text-xl gradient-text hidden sm:block">FoodHub</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines, dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-full bg-gray-100 border border-transparent focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-3">
            <button className="hidden sm:flex items-center gap-1 text-sm text-dark-600 hover:text-primary-600 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
              <HiLocationMarker className="w-4 h-4 text-primary-600" />
              <span className="max-w-[120px] truncate">Mumbai</span>
            </button>

            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 text-dark-600 dark:text-dark-300 transition-colors text-lg"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hidden lg:block text-sm font-medium text-dark-600 hover:text-primary-600 px-3 py-2 rounded-xl hover:bg-gray-50">
                    Admin
                  </Link>
                )}
                {user?.role === 'restaurant' && (
                  <Link to="/restaurant/dashboard" className="hidden lg:block text-sm font-medium text-dark-600 hover:text-primary-600 px-3 py-2 rounded-xl hover:bg-gray-50">
                    Dashboard
                  </Link>
                )}
                <Link to="/wishlist" className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <IoHeart className="w-5 h-5 text-dark-600" />
                </Link>
                <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <IoCart className="w-5 h-5 text-dark-600" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
                <div className="relative">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <IoPerson className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-dark-700 max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in">
                      <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-dark-600 hover:bg-gray-50">Profile</Link>
                      <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-dark-600 hover:bg-gray-50">My Orders</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <IoLogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-dark-600 hover:text-primary-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-5">
                  Sign Up
                </Link>
              </div>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-50">
              <IoMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
