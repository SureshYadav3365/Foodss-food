import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoSearch, 
  IoCart, 
  IoHeart, 
  IoPerson, 
  IoMenu, 
  IoLogOut, 
  IoClose, 
  IoLocateOutline, 
  IoNavigate,
  IoAdd,
  IoRemove,
  IoEarthOutline
} from 'react-icons/io5';
import { HiLocationMarker } from 'react-icons/hi';
import { logout } from '../../store/slices/authSlice';
import { selectCartCount } from '../../store/slices/cartSlice';
import { setSearchQuery, toggleTheme } from '../../store/slices/uiSlice';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Modal State
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [mapSatellite, setMapSatellite] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      dispatch(setSearchQuery(search));
      navigate(`/restaurants?search=${search}`);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-gray-100 dark:border-dark-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🍔</span>
              <span className="font-display font-extrabold text-xl bg-gradient-to-r from-primary-600 to-orange-500 bg-clip-text text-transparent">
                FoodHub
              </span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, dishes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 rounded-full bg-gray-100 dark:bg-dark-800 border border-transparent dark:border-dark-700 focus:bg-white dark:focus:bg-dark-750 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                />
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-1 sm:gap-3">
              <button 
                onClick={() => setShowLocationModal(true)}
                className="hidden sm:flex items-center gap-1 text-sm text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
              >
                <HiLocationMarker className="w-4 h-4 text-primary-600" />
                <span className="max-w-[120px] truncate">Nagal Koju</span>
              </button>

              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 text-dark-600 dark:text-dark-300 transition-colors text-lg"
                title="Toggle Light/Dark Theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              {isAuthenticated && (
                <>
                  <Link to="/wishlist" className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 text-dark-600 dark:text-dark-300 transition-colors relative" title="Wishlist">
                    <IoHeart className="w-5 h-5" />
                  </Link>

                  <Link to="/cart" className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 text-dark-600 dark:text-dark-300 transition-colors relative" title="Cart">
                    <IoCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-1 bg-primary-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-dark-900">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {isAuthenticated ? (
                <>
                  <div className="h-6 w-px bg-gray-200 dark:bg-dark-700" />
                  
                  {/* User Actions */}
                  <div className="flex items-center gap-2">
                    <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-dark-800 p-1.5 rounded-xl transition-all border border-gray-100 dark:border-dark-700/60 shadow-sm relative">
                      <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline text-xs font-semibold text-dark-800 dark:text-dark-200">
                        {user?.name?.split(' ')[0]}
                      </span>
                      {/* Notification Dot */}
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    </Link>

                    {user?.role === 'admin' && (
                      <Link to="/admin" className="text-xs font-bold text-primary-600 hover:underline px-2">Admin</Link>
                    )}
                    {user?.role === 'restaurant' && (
                      <Link to="/restaurant/dashboard" className="text-xs font-bold text-primary-600 hover:underline px-2">Panel</Link>
                    )}

                    <button 
                      onClick={() => { dispatch(logout()); navigate('/'); }} 
                      className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 transition-colors"
                      title="Logout"
                    >
                      <IoLogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="text-sm font-medium text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary text-sm py-2 px-5">
                    Sign Up
                  </Link>
                </div>
              )}

              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 dark:text-white">
                <IoMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Interactive Location Picker Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-dark-800 rounded-3xl p-6 max-w-xl w-full relative shadow-2xl border border-gray-100 dark:border-dark-700/60 transition-colors text-dark-900 dark:text-white"
            >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-black text-lg tracking-tight">
                  Select Delivery Location
                </h3>
                <button 
                  onClick={() => setShowLocationModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 dark:bg-dark-900 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-dark-750 transition-colors"
                >
                  <IoClose className="w-5 h-5 text-dark-500" />
                </button>
              </div>

              {/* Location Search Bar & Current Location Button */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch mb-4">
                <div className="flex-1 relative flex items-center bg-gray-50 dark:bg-dark-900 border border-gray-200/60 dark:border-dark-700/60 rounded-xl px-3.5">
                  <IoSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    defaultValue="Nagal Koju, Rajasthan"
                    className="w-full pl-2.5 pr-2 py-2.5 bg-transparent text-sm font-semibold outline-none text-dark-800 dark:text-slate-200"
                  />
                </div>
                <button 
                  onClick={() => toast.success('Fetched your precise GPS location!')}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-primary-100 hover:border-primary-200 dark:border-dark-700 bg-primary-50 dark:bg-primary-950/20 hover:bg-primary-100 text-primary-600 dark:text-primary-400 font-bold rounded-xl text-xs transition-colors active:scale-98"
                >
                  <IoLocateOutline className="w-4 h-4" /> Current Location
                </button>
              </div>

              {/* Interactive Map View */}
              <div className="relative w-full h-72 bg-slate-100 dark:bg-dark-900 rounded-2xl overflow-hidden border border-gray-200/60 dark:border-dark-700/60 shadow-inner">
                
                {/* Embed Map focused on Nagal Koju, Rajasthan */}
                <iframe
                  title="Nagal Koju Map View"
                  src={`https://maps.google.com/maps?q=Nagal%20Koju,%20Rajasthan&t=${mapSatellite ? 'k' : ''}&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0 transition-opacity"
                  allowFullScreen=""
                  loading="lazy"
                />

                {/* Satellite Toggle Button */}
                <button 
                  onClick={() => setMapSatellite(!mapSatellite)}
                  className="absolute bottom-3 left-3 bg-white dark:bg-dark-800 hover:bg-slate-50 text-dark-700 dark:text-slate-200 shadow-md p-2 rounded-lg border border-gray-100 dark:border-dark-700 flex items-center gap-1 text-[10px] font-extrabold tracking-wider uppercase transition-colors"
                >
                  <IoEarthOutline className="w-3.5 h-3.5 text-primary-500" />
                  {mapSatellite ? 'Map View' : 'Satellite'}
                </button>

                {/* Custom Map Zoom Controls */}
                <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
                  <button className="w-8 h-8 bg-white dark:bg-dark-800 text-dark-700 dark:text-slate-200 shadow-md rounded-lg flex items-center justify-center border border-gray-100 dark:border-dark-700 font-bold active:scale-90 hover:bg-slate-50 transition-all text-xs">
                    <IoAdd className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-white dark:bg-dark-800 text-dark-700 dark:text-slate-200 shadow-md rounded-lg flex items-center justify-center border border-gray-100 dark:border-dark-700 font-bold active:scale-90 hover:bg-slate-50 transition-all text-xs">
                    <IoRemove className="w-4 h-4" />
                  </button>
                </div>

                {/* Custom Radar Wave Pin Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative flex flex-col items-center">
                    {/* Pulsing Geo Waves */}
                    <div className="absolute w-12 h-12 bg-primary-500/35 rounded-full animate-ping" />
                    <div className="absolute w-20 h-20 bg-primary-500/10 rounded-full animate-ping delay-200" />
                    {/* Brand pin */}
                    <IoNavigate className="w-9 h-9 text-primary-600 drop-shadow-lg rotate-180 transform -translate-y-2" />
                  </div>
                </div>

              </div>

              {/* Confirm location details */}
              <p className="text-xs text-dark-400 dark:text-dark-500 mb-6 font-medium text-left leading-relaxed">
                * Pin location marks Nagal Koju, Rajasthan center. You can drag and pan the map to adjust exact drop points.
              </p>

              {/* Action Proceed Button */}
              <button 
                onClick={() => {
                  setShowLocationModal(false);
                  toast.success('Delivery location confirmed successfully!');
                }}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-extrabold py-3.5 px-6 rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg active:scale-98"
              >
                Confirm Location & Proceed
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
