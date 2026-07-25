import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { IoCopy } from 'react-icons/io5';
import { couponAPI } from '../api';
import Layout from '../components/layout/Layout';
import Loader from '../components/common/Loader';

const Offers = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await couponAPI.getAll();
        setCoupons(response.data.data);
      } catch (err) {
        console.error('Failed to load coupons:', err);
        toast.error('Unable to retrieve promotional coupons');
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
  };

  const banners = [
    { title: 'Craving For Discounts?', sub: 'Get flat 50% off on your first order using code WELCOME50', color: 'from-pink-500 to-rose-500' },
    { title: 'Free Deliveries Weekend', sub: 'Enjoy ₹0 delivery fee on orders above ₹399', color: 'from-violet-500 to-indigo-500' },
    { title: 'Healthy Bites, Healthy Price', sub: 'Get 20% off on all salads & vegan diets', color: 'from-emerald-500 to-teal-500' },
  ];

  if (loading) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-dark-900 min-h-screen py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold font-display text-dark-900 dark:text-white">
              Deals & <span className="gradient-text">Offers</span>
            </h1>
            <p className="mt-2 text-dark-600 dark:text-dark-400">
              Save big on your favorite food items with active coupons and promotions.
            </p>
          </div>

          {/* Promos Carousel / Slider */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {banners.map((banner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`bg-gradient-to-r ${banner.color} p-8 rounded-3xl text-white shadow-md relative overflow-hidden`}
              >
                <div className="relative z-10 space-y-2">
                  <h3 className="text-2xl font-bold font-display">{banner.title}</h3>
                  <p className="text-sm opacity-90">{banner.sub}</p>
                </div>
                <div className="absolute right-0 bottom-0 text-9xl opacity-10 pointer-events-none translate-x-4 translate-y-4">
                  🏷️
                </div>
              </motion.div>
            ))}
          </div>

          <h2 className="text-2xl font-bold font-display text-dark-800 dark:text-white mb-6">
            Available Coupon Codes
          </h2>

          {coupons.length === 0 ? (
            <div className="bg-white dark:bg-dark-800 p-8 rounded-3xl text-center border border-gray-100 dark:border-dark-700/60 shadow-sm">
              <span className="text-4xl block mb-2">🎟️</span>
              <p className="text-dark-500 dark:text-dark-400">No coupon codes are currently active. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon, index) => (
                <motion.div
                  key={coupon._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-gray-100 dark:border-dark-700/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-xs font-semibold">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% OFF`
                          : `₹${coupon.discountValue} FLAT OFF`}
                      </span>
                    </div>
                    <span className="text-xs text-dark-400 dark:text-dark-500 font-medium">
                      Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-dark-800 dark:text-white font-display mb-1">
                    {coupon.description || `Save ${coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} on your order`}
                  </h3>
                  <p className="text-xs text-dark-500 dark:text-dark-400 mb-6">
                    Minimum order amount: ₹{coupon.minOrder}
                  </p>

                  <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-700/50 rounded-2xl p-3 border border-dashed border-gray-200 dark:border-dark-600">
                    <span className="font-mono font-bold text-dark-800 dark:text-white tracking-wider text-sm">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(coupon.code)}
                      className="p-2 bg-white dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-700 text-dark-600 dark:text-dark-300 rounded-xl transition-all shadow-sm flex items-center justify-center"
                      title="Copy Coupon Code"
                    >
                      <IoCopy className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Offers;
