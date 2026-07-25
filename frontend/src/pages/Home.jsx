import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoArrowForward, 
  IoStar, 
  IoBicycle, 
  IoTimeOutline, 
  IoStorefront, 
  IoFastFood, 
  IoCheckmarkCircle, 
  IoChevronDown,
  IoMailOutline,
  IoPhonePortraitOutline,
  IoQrCodeOutline,
  IoClose
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import CategorySection from '../components/home/CategorySection';

const Counter = ({ target, suffix = '', duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const isDecimal = target.includes('.');
    const end = parseFloat(target.replace(/,/g, '')) || 0;
    if (end === 0) {
      setCount(target);
      return;
    }
    
    const steps = 60;
    const stepValue = end / steps;
    let current = 0;
    let stepCount = 0;

    const timer = setInterval(() => {
      current += stepValue;
      stepCount++;
      if (stepCount >= steps) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target, duration, hasAnimated]);

  const formatNum = (num) => {
    if (typeof num === 'string') return num;
    const isDecimal = target.includes('.');
    if (isDecimal) {
      return num.toFixed(1);
    }
    return num.toLocaleString();
  };

  return <span ref={ref}>{formatNum(count)}{suffix}</span>;
};
import RestaurantCard from '../components/restaurant/RestaurantCard';
import FoodCard from '../components/food/FoodCard';
import Loader from '../components/common/Loader';
import { restaurantAPI, categoryAPI, foodAPI } from '../api';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [popularRestaurants, setPopularRestaurants] = useState([]);
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
  const [trendingFoods, setTrendingFoods] = useState([]);
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [popularDishes, setPopularDishes] = useState([]);
  const [bestSellingFoods, setBestSellingFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Email state for Newsletter
  const [email, setEmail] = useState('');

  // Mobile App Download States & Refs
  const [showQRModal, setShowQRModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (showVideoModal && videoRef.current) {
      setVideoError(false);
      setAutoplayBlocked(false);
      setVideoPlaying(false);

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoPlaying(true);
          })
          .catch((error) => {
            console.log("Autoplay was prevented by browser:", error);
            setAutoplayBlocked(true);
          });
      }
    }
  }, [showVideoModal]);

  const handleCompatibleClick = () => {
    setShowVideoModal(true);
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Play failed:", err);
      });
    }
  };

  const handleGooglePlayClick = () => {
    toast.success('Thank you so much! App downloading will begin shortly.');
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon "${code}" copied to clipboard!`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, catRes, foodRes] = await Promise.all([
          restaurantAPI.getAll({ limit: 20 }),
          categoryAPI.getAll(),
          foodAPI.getAll({ limit: 40 }),
        ]);

        const allRestaurants = restRes.data.data.restaurants || [];
        const allFoods = foodRes.data.data.foods || [];

        setCategories(catRes.data.data || []);
        
        // Popular Restaurants: First 4
        setPopularRestaurants(allRestaurants.slice(0, 4));
        
        // Top Rated Restaurants: Rating >= 4.5
        setTopRatedRestaurants(allRestaurants.filter(r => r.rating >= 4.5).slice(0, 4));

        // Trending Foods: Rating >= 4.7
        setTrendingFoods(allFoods.filter(f => f.rating >= 4.7).slice(0, 4));

        // Featured Foods: Rating between 4.5 and 4.6
        setFeaturedFoods(allFoods.filter(f => f.rating >= 4.5 && f.rating < 4.7).slice(0, 4));

        // Popular Dishes: First 8
        setPopularDishes(allFoods.slice(0, 8));

        // Best Selling Foods: Foods with tag bestseller
        setBestSellingFoods(allFoods.filter(f => f.tags?.includes('bestseller')).slice(0, 4));

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Layout><Loader fullScreen /></Layout>;

  return (
    <Layout>
      {/* 2. Hero Banner */}
      <Hero />

      {/* 3. Food Categories */}
      <CategorySection categories={categories} />

      {/* 4. Popular Restaurants */}
      {popularRestaurants.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-50 dark:border-dark-800/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-dark-900 dark:text-white tracking-tight">
                Popular Restaurants
              </h2>
              <p className="text-dark-500 dark:text-dark-400 mt-1">Trending culinary spots loved by locals</p>
            </div>
            <Link to="/restaurants" className="group flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-semibold transition-colors text-sm">
              View All Restaurants <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRestaurants.map((r, i) => <RestaurantCard key={r._id} restaurant={r} index={i} />)}
          </div>
        </section>
      )}

      {/* 5. Trending Foods */}
      {trendingFoods.length > 0 && (
        <section className="bg-slate-50 dark:bg-dark-950/40 py-16 transition-colors border-y border-gray-100 dark:border-dark-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-dark-900 dark:text-white tracking-tight">
                  Trending Foods
                </h2>
                <p className="text-dark-500 dark:text-dark-400 mt-1">Highly rated local dishes of the week</p>
              </div>
              <Link to="/restaurants" className="group flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-semibold transition-colors text-sm">
                Explore Foods <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingFoods.map((f, i) => <FoodCard key={f._id} food={f} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* 6. Featured Foods */}
      {featuredFoods.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-dark-900 dark:text-white tracking-tight">
                Featured Foods
              </h2>
              <p className="text-dark-500 dark:text-dark-400 mt-1">Handpicked recipes recommended for you</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFoods.map((f, i) => <FoodCard key={f._id} food={f} index={i} />)}
          </div>
        </section>
      )}

      {/* 7. Today's Offers */}
      <section className="bg-gradient-to-br from-primary-600 to-orange-600 py-16 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-92 h-92 bg-white rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-400 rounded-full blur-2xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight mb-2">Today's Special Offers</h2>
          <p className="text-white/80 mb-10 max-w-md mx-auto text-sm sm:text-base">Use these coupon codes at checkout to get premium discounts on your meals.</p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { code: 'WELCOME50', desc: '50% off on first order', info: 'Up to ₹150 | Min order ₹199' },
              { code: 'FLAT100', desc: 'Flat ₹100 off your meal', info: 'Valid on orders above ₹399' },
              { code: 'FOODIE20', desc: '20% off all popular dishes', info: 'Up to ₹80 | Min order ₹299' },
            ].map((offer, idx) => (
              <motion.div
                key={offer.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col justify-between items-center text-center relative"
              >
                <div className="absolute -top-3.5 bg-yellow-400 text-dark-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Special Deal
                </div>
                <div className="mt-2">
                  <h3 className="text-xl font-extrabold tracking-tight">{offer.desc}</h3>
                  <p className="text-white/70 text-xs mt-2">{offer.info}</p>
                </div>
                <button
                  onClick={() => handleCopyCoupon(offer.code)}
                  className="mt-6 w-full py-2.5 px-4 bg-white hover:bg-yellow-300 text-primary-700 hover:text-dark-900 font-extrabold rounded-xl transition-all duration-200 text-sm tracking-wide active:scale-98"
                >
                  Code: {offer.code}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Popular Dishes */}
      {popularDishes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-gray-100 dark:border-dark-800/60">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-dark-900 dark:text-white tracking-tight">
                Popular Dishes
              </h2>
              <p className="text-dark-500 dark:text-dark-400 mt-1">Our customer favorites across the platform</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((f, i) => <FoodCard key={f._id} food={f} index={i} />)}
          </div>
        </section>
      )}

      {/* 9. Best Selling Foods */}
      {bestSellingFoods.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-dark-900 dark:text-white tracking-tight">
                Best Selling Foods
              </h2>
              <p className="text-dark-500 dark:text-dark-400 mt-1">Top sales volume and high demand selections</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellingFoods.map((f, i) => <FoodCard key={f._id} food={f} index={i} />)}
          </div>
        </section>
      )}

      {/* 10. How It Works */}
      <section className="bg-slate-50 dark:bg-dark-950/40 py-16 transition-colors border-t border-gray-100 dark:border-dark-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-dark-900 dark:text-white tracking-tight mb-2">
            How It Works
          </h2>
          <p className="text-dark-500 dark:text-dark-400 max-w-md mx-auto text-sm mb-12">Getting premium food delivered is incredibly simple</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose Your Dish', desc: 'Select from our wide range of categories, restaurants, and premium meals.', icon: <IoFastFood className="w-8 h-8 text-primary-600" /> },
              { step: '02', title: 'Secure Checkout', desc: 'Place your order using card, UPI, cash, or wallet with instant validation.', icon: <IoStorefront className="w-8 h-8 text-amber-500" /> },
              { step: '03', title: 'Fast Delivery', desc: 'Our delivery partners route your food warm in under 30 minutes flat.', icon: <IoBicycle className="w-8 h-8 text-green-500" /> }
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 relative border border-gray-50 dark:border-dark-700/60"
              >
                <div className="absolute top-4 right-6 text-4xl font-black text-gray-100 dark:text-dark-700 select-none">
                  {item.step}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-dark-900 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2 text-left">{item.title}</h3>
                <p className="text-sm text-dark-500 dark:text-dark-400 text-left leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-dark-900 dark:text-white tracking-tight mb-2">
            What Our Customers Say
          </h2>
          <p className="text-dark-500 dark:text-dark-400 text-sm">Real reviews from our regular foodies</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Rahul Sharma', role: 'Daily Customer', text: 'Amazing user experience! The delivery is always on time, and the foods arrive steaming hot. The Masala Dosa from Dosa Corner is out of this world.', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
            { name: 'Aditi Verma', role: 'Food Blogger', text: 'I love the dark mode theme and overall premium look of the web platform. Plus, the detailed calorie counts make it so easy to maintain my healthy macros.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
            { name: 'Karan Malhotra', role: 'Weekly Diner', text: 'Great coupon discounts! Saved a lot using FLAT100 today. The Double Smash Burger was cooked to perfection and reached under 20 mins.', rating: 4.8, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
          ].map((rev, idx) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-dark-700/60 flex flex-col justify-between"
            >
              <p className="text-sm text-dark-600 dark:text-dark-300 italic leading-relaxed mb-6">
                "{rev.text}"
              </p>
              <div className="flex items-center gap-4 border-t border-gray-50 dark:border-dark-700/60 pt-4">
                <img src={rev.avatar} alt={rev.name} className="w-11 h-11 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-dark-900 dark:text-white truncate">{rev.name}</h4>
                  <p className="text-xs text-dark-400 truncate">{rev.role}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-600 px-2 py-0.5 rounded-lg text-xs font-bold">
                  <IoStar className="w-3.5 h-3.5 text-yellow-400" /> {rev.rating}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 12. Top Rated Restaurants */}
      {topRatedRestaurants.length > 0 && (
        <section className="bg-slate-50 dark:bg-dark-950/40 py-16 transition-colors border-y border-gray-100 dark:border-dark-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-dark-900 dark:text-white tracking-tight">
                  Top Rated Restaurants
                </h2>
                <p className="text-dark-500 dark:text-dark-400 mt-1">Highest user ratings and pristine kitchens</p>
              </div>
              <Link to="/restaurants" className="group flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-semibold transition-colors text-sm">
                See All <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topRatedRestaurants.map((r, i) => <RestaurantCard key={r._id} restaurant={r} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* 13. Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '15000', suffix: '+', label: 'Delivered Orders', duration: 2000 },
            { value: '10', suffix: '+', label: 'Premium Brands', duration: 2500 },
            { value: '12000', suffix: '+', label: 'Happy Customers', duration: 2200 },
            { value: '4.9', suffix: '★', label: 'App Store Rating', duration: 2000 }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700/60 shadow-sm"
            >
              <h3 className="text-3xl md:text-4xl font-display font-black text-red-600 dark:text-red-500">
                <Counter target={stat.value} suffix={stat.suffix} duration={stat.duration} />
              </h3>
              <p className="text-sm font-semibold text-dark-500 dark:text-dark-400 mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 14. Download Mobile App Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-slate-900 to-dark-950 dark:from-dark-850 dark:to-dark-950 rounded-3xl overflow-hidden p-6 sm:p-8 md:p-12 text-white border border-slate-800 dark:border-dark-800 shadow-2xl relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
          <div className="grid md:grid-cols-12 gap-12 items-center">
            
            {/* Left Box: Text Copy, QR and App Stores */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-display font-black mb-4 tracking-tight leading-tight">
                Order easily on the <br />
                <span className="text-primary-500">FoodHub Mobile App</span>
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg text-sm sm:text-base leading-relaxed">
                Scan the QR code or click below to install the application. Enjoy real-time tracking, push notifications, and exclusive flash deal vouchers.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-8 max-w-md">
                <button
                  onClick={() => setShowQRModal(true)}
                  className="flex items-center text-left w-full gap-3 bg-slate-800/40 border border-slate-700/40 p-3.5 rounded-xl cursor-pointer hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-200 active:scale-[0.98] outline-none"
                >
                  <IoQrCodeOutline className="w-10 h-10 text-primary-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Scan QR Code</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Instant Mobile Link</p>
                  </div>
                </button>
                <button
                  onClick={handleCompatibleClick}
                  className="flex items-center text-left w-full gap-3 bg-slate-800/40 border border-slate-700/40 p-3.5 rounded-xl cursor-pointer hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-200 active:scale-[0.98] outline-none"
                >
                  <IoPhonePortraitOutline className="w-10 h-10 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Compatible</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">iOS & Android</p>
                  </div>
                </button>
              </div>

              <div className="flex flex-wrap gap-4">
                <button className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-6 py-3 rounded-xl transition-all duration-200 text-sm shadow-md active:scale-98">
                  Download on App Store
                </button>
                <button
                  onClick={handleGooglePlayClick}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold px-6 py-3 rounded-xl transition-all duration-200 text-sm border border-slate-700 active:scale-98"
                >
                  Get it on Google Play
                </button>
              </div>
            </div>

            {/* Right Box: Highly Polished CSS Phone Mockup */}
            <div className="md:col-span-5 flex justify-center relative">
              <div className="relative w-64 h-120 bg-slate-950 border-4 border-slate-800 rounded-[40px] shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
                {/* Speaker Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-full z-20" />
                
                {/* Simulated Screen */}
                <div className="flex-1 rounded-[32px] bg-slate-900 overflow-hidden relative p-4 flex flex-col justify-between z-10 select-none">
                  {/* Status Bar */}
                  <div className="flex justify-between text-[8px] text-slate-400 font-bold mb-4 px-2">
                    <span>9:41 AM</span>
                    <span className="flex items-center gap-1">🔋 5G</span>
                  </div>

                  {/* App Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8px] text-slate-500">DELIVER TO</p>
                      <p className="text-[10px] font-bold text-white">Nagal Koju, RJ 📍</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                      👤
                    </div>
                  </div>

                  {/* Map tracking graphic */}
                  <div className="my-3 flex-1 bg-slate-800 rounded-xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-700/60">
                    {/* Simulated Path Line */}
                    <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                    <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center animate-ping absolute" />
                    <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white relative z-10 shadow-lg text-lg">
                      🛵
                    </div>
                    <span className="text-[8px] font-bold text-slate-400 mt-2 z-10 bg-slate-950/70 py-0.5 px-2 rounded-full">
                      Courier is nearby
                    </span>
                  </div>

                  {/* Incoming Notification Float Card */}
                  <div className="bg-slate-950/90 border border-slate-800/80 p-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-bold text-white">Order Confirmed</p>
                      <p className="text-[6px] text-slate-400 mt-0.5">Your food will arrive in 15 mins</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 15. Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100 dark:border-dark-800/60">
        <div className="bg-slate-50 dark:bg-dark-800/40 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-dark-700/40 relative overflow-hidden text-center max-w-4xl mx-auto">
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-primary-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-dark-900 dark:text-white tracking-tight mb-2">
            Join the Foodie Club
          </h2>
          <p className="text-dark-500 dark:text-dark-400 text-sm max-w-md mx-auto mb-8">
            Subscribe to our newsletter for flash deals, new restaurant entries, and cooking tips.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative flex items-center">
              <IoMailOutline className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white outline-none text-sm focus:border-primary-500 dark:focus:border-primary-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 text-sm shadow-md active:scale-98"
            >
              Subscribe Now
            </button>
          </form>
        </div>
      </section>

      {/* 16. FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-dark-900 dark:text-white tracking-tight text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            { q: 'How long does delivery usually take?', a: 'Most deliveries are completed within 20 to 35 minutes depending on your distance from the restaurant and current road traffic.' },
            { q: 'Is there a minimum order amount?', a: 'Yes, most restaurants require a minimum order value of ₹99 to qualify for delivery services.' },
            { q: 'How can I apply a coupon code?', a: 'You can input coupon codes (like WELCOME50 or FLAT100) directly on the checkout summary page before finalizing the payment method.' },
            { q: 'Can I track my order in real-time?', a: 'Absolutely! Once your order is accepted, you can view the live progress from order confirmation to pick-up and delivery on your dashboard.' }
          ].map((faq, idx) => {
            const isFaqOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700/60 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isFaqOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-dark-900 dark:text-white hover:bg-slate-50 dark:hover:bg-dark-750 transition-colors"
                >
                  <span className="text-sm md:text-base">{faq.q}</span>
                  <IoChevronDown className={`w-5 h-5 text-dark-400 transition-transform duration-250 ${isFaqOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isFaqOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-5 pt-0 text-sm text-dark-500 dark:text-dark-400 border-t border-gray-50 dark:border-dark-700/40 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 17. Modals for Mobile App Download Actions */}
      <AnimatePresence>
        {showQRModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-[92vw] max-h-[90vh] overflow-y-auto relative text-center text-white shadow-2xl"
            >
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                title="Close"
              >
                <IoClose className="w-6 h-6" />
              </button>
              <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-inner">
                <img src="/qr_code.png" alt="App QR Code" className="w-48 h-48 object-contain" />
              </div>
              <p className="text-sm text-slate-300 font-semibold px-4 leading-relaxed">
                Scan with your phone camera to download the app
              </p>
            </motion.div>
          </div>
        )}

        {showVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl w-[92vw] max-h-[90vh] overflow-y-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative bg-slate-950 min-h-[200px] flex items-center justify-center"
            >
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 z-10 text-white/85 hover:text-white bg-black/40 hover:bg-black/60 p-1.5 rounded-full transition-colors"
                title="Close"
              >
                <IoClose className="w-5 h-5" />
              </button>

              {videoError ? (
                <div className="w-full aspect-video bg-slate-900 flex flex-col items-center justify-center text-center p-6 text-white relative">
                  <img
                    src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2I1ZmY3YjA5ZGU3NmVjNjg4NTllOWM2YTM4YzM5NmQ2ZDA4NmVlNSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/L1R1TvI9svvvnGlOPY/giphy.gif"
                    alt="Delivery rider animation fallback"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
                    <p className="text-sm font-bold text-slate-200">
                      Video Playback Failed
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Showing animated fallback instead.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full aspect-video">
                  <video
                    ref={videoRef}
                    src="https://assets.mixkit.co/videos/preview/mixkit-delivery-man-riding-a-motorcycle-41584-large.mp4"
                    autoPlay
                    playsInline
                    muted
                    loop={false}
                    onError={() => setVideoError(true)}
                    onEnded={() => setShowVideoModal(false)}
                    onTimeUpdate={(e) => {
                      if (e.target.currentTime >= 4) {
                        setShowVideoModal(false);
                      }
                    }}
                    className="w-full h-full object-cover"
                  />

                  {autoplayBlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-xs">
                      <button
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.play()
                              .then(() => {
                                setAutoplayBlocked(false);
                                setVideoPlaying(true);
                              })
                              .catch((err) => console.log("Play failed again:", err));
                          }
                        }}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-extrabold py-3 px-6 rounded-full flex items-center gap-2 shadow-lg transition-all duration-200 active:scale-95 text-sm"
                      >
                        ▶ Play Video
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Home;
