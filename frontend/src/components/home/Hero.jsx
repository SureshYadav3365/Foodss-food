import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoSearch, IoLocation, IoStar, IoTimeOutline, IoCheckmarkCircle } from 'react-icons/io5';

const Hero = () => {
  return (
    <section className="relative bg-slate-50 dark:bg-dark-900 border-b border-gray-100 dark:border-dark-800 transition-colors duration-300 overflow-hidden py-16 md:py-24">
      {/* Premium Background Gradients & Decorative Circles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-100/40 dark:bg-primary-950/15 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-amber-100/40 dark:bg-amber-950/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Search & Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7 flex flex-col justify-center"
          >
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold mb-6 w-fit border border-primary-100/50 dark:border-primary-900/30">
              <IoCheckmarkCircle className="w-4 h-4" /> Discover premium culinary delights
            </div>

            {/* Typography Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-dark-900 dark:text-white leading-tight tracking-tight mb-6">
              Premium flavors, <br />
              delivered straight to <span className="text-primary-600 dark:text-primary-400 relative inline-block">
                your door
                <span className="absolute bottom-1 left-0 w-full h-[6px] bg-primary-500/25 rounded" />
              </span>
            </h1>

            {/* Sub-description */}
            <p className="text-base sm:text-lg text-dark-500 dark:text-dark-400 mb-8 max-w-xl">
              Order from over 10+ premium local restaurants, featuring 35+ handcrafted delicacies with fast 30-minute delivery guarantees.
            </p>

            {/* Interactive Search Bar & Delivery Location */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl bg-white dark:bg-dark-800 p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-700/60 mb-10 transition-colors">
              <div className="flex-1 relative flex items-center">
                <IoLocation className="absolute left-4 w-5 h-5 text-primary-500" />
                <input
                  type="text"
                  placeholder="Your delivery location..."
                  defaultValue="Nagal Koju, Rajasthan"
                  className="w-full pl-12 pr-4 py-3 bg-transparent text-dark-800 dark:text-white outline-none text-sm font-medium"
                />
              </div>
              <div className="h-px sm:h-8 w-full sm:w-px bg-gray-200 dark:bg-dark-700 my-1 sm:my-0" />
              <Link 
                to="/restaurants" 
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-200 text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-primary-500/10 active:scale-98 text-sm"
              >
                <IoSearch className="w-4 h-4" /> Find Restaurants
              </Link>
            </div>

            {/* Live Statistics Counter Panel */}
            <div className="flex flex-wrap gap-8 items-center border-t border-gray-100 dark:border-dark-800 pt-8 transition-colors">
              {[
                { n: '10+', l: 'Premium Brands' }, 
                { n: '35+', l: 'Dishes Available' }, 
                { n: '30 min', l: 'Average Delivery' }
              ].map((s) => (
                <div key={s.l} className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-dark-900 dark:text-white">
                    {s.n}
                  </span>
                  <span className="text-xs sm:text-sm text-dark-400 dark:text-dark-500 font-medium mt-0.5">
                    {s.l}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Premium Collage with Floating Cards */}
          <div className="md:col-span-5 relative flex justify-center items-center py-8">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              
              {/* Main Background Glow Circle */}
              <div className="absolute inset-4 bg-gradient-to-br from-amber-400 to-primary-600 rounded-full opacity-10 blur-xl animate-pulse" />

              {/* Main Dish Center Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="w-full h-full rounded-full overflow-hidden border-8 border-white dark:border-dark-800 shadow-2xl relative z-10 bg-white dark:bg-dark-800"
              >
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600"
                  alt="Delicious Italian Pizza"
                  className="w-full h-full object-cover select-none"
                />
              </motion.div>

              {/* Floating Card 1: Popular Double Smash Burger with Classical Dish */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 z-20 bg-white/90 dark:bg-dark-800/90 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gray-100/50 dark:border-dark-700/60 flex items-center gap-3 w-52"
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=100" 
                    alt="Classical" 
                    className="w-12 h-12 rounded-xl object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100';
                    }}
                  />
                  <span className="text-[10px] font-bold text-dark-500 dark:text-dark-400 mt-1">Classical</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-dark-900 dark:text-white truncate">Smash Burger</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <IoStar className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-[10px] font-bold text-dark-600 dark:text-dark-300">4.8 rated</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 2: Biryani Order Tracking Card */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 -left-12 z-20 bg-white/90 dark:bg-dark-800/90 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-gray-100/50 dark:border-dark-700/60 flex items-center gap-3 w-52"
              >
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-950/40 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <IoTimeOutline className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-dark-400 dark:text-dark-500">Fast Delivery</p>
                  <p className="text-xs font-bold text-dark-900 dark:text-white mt-0.5">⏱ 20-30 Mins Express</p>
                </div>
              </motion.div>

              {/* Floating Card 3: Healthy Bowl Card */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -right-4 z-20 bg-white/90 dark:bg-dark-800/90 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gray-100/50 dark:border-dark-700/60 flex items-center gap-2.5 w-44"
              >
                <img 
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100" 
                  alt="Healthy Bowl" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-dark-950 dark:text-white">Healthy Salad</p>
                  <p className="text-[10px] font-semibold text-green-500 mt-0.5">🌱 100% Organic</p>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
