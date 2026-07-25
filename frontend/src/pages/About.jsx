import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';

const About = () => {
  const stats = [
    { label: 'Active Restaurants', value: '500+' },
    { label: 'Monthly Deliveries', value: '50K+' },
    { label: 'Cities Covered', value: '15+' },
    { label: 'Average Delivery Time', value: '25 mins' },
  ];

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-dark-900 min-h-screen transition-colors py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-extrabold font-display text-dark-900 dark:text-white"
            >
              Our Mission is to <span className="gradient-text">Redefine Delivery</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg text-dark-600 dark:text-dark-400"
            >
              FoodHub brings your favorite culinary spots straight to your doorstep, combining fresh local options with lightning-fast delivery and a seamless user interface.
            </motion.p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700/60 text-center"
              >
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-500 font-display mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-dark-500 dark:text-dark-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-dark-900 dark:text-white font-display">
                Who We Are
              </h2>
              <p className="text-dark-600 dark:text-dark-400 leading-relaxed">
                Founded in 2024, FoodHub was born out of a desire to make ordering food an exceptionally smooth and satisfying experience. We partner with top-rated local eateries and professional couriers to deliver hot, premium food securely.
              </p>
              <p className="text-dark-600 dark:text-dark-400 leading-relaxed">
                We believe that premium quality service doesn't have to mean complex interfaces. With glassmorphic layouts, advanced tracking, and curated discount programs, we are constantly innovating to serve you better.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-3xl overflow-hidden shadow-lg bg-gradient-to-tr from-primary-500 to-orange-400 p-8 flex items-center justify-center text-white"
            >
              <div className="text-center space-y-4">
                <span className="text-6xl block animate-bounce-soft">🍕🍣🍦</span>
                <span className="font-display text-xl font-bold tracking-wider">FOODHUB DELIVERY TEAM</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
