import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import CategorySection from '../components/home/CategorySection';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import FoodCard from '../components/food/FoodCard';
import Loader from '../components/common/Loader';
import { restaurantAPI, categoryAPI, foodAPI } from '../api';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, restRes, catRes, foodRes] = await Promise.all([
          restaurantAPI.getAll({ featured: true, limit: 4 }),
          restaurantAPI.getAll({ limit: 6, sort: 'rating' }),
          categoryAPI.getAll(),
          foodAPI.getAll({ sort: 'rating', limit: 8 }),
        ]);
        setFeatured(featRes.data.data.restaurants);
        setRestaurants(restRes.data.data.restaurants);
        setCategories(catRes.data.data);
        setPopularFoods(foodRes.data.data.foods);
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
      <Hero />
      <CategorySection categories={categories} />

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Featured Restaurants</h2>
              <p className="text-dark-500 mt-1">Top picks for you</p>
            </div>
            <Link to="/restaurants" className="text-primary-600 font-semibold hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((r, i) => <RestaurantCard key={r._id} restaurant={r} index={i} />)}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Popular Dishes</h2>
            <p className="text-dark-500 mt-1">Trending right now</p>
          </div>
          <Link to="/restaurants" className="text-primary-600 font-semibold hover:underline">Explore</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularFoods.map((f, i) => <FoodCard key={f._id} food={f} index={i} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">All Restaurants</h2>
            <p className="text-dark-500 mt-1">Discover places near you</p>
          </div>
          <Link to="/restaurants" className="text-primary-600 font-semibold hover:underline">See All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r, i) => <RestaurantCard key={r._id} restaurant={r} index={i} />)}
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="bg-gradient-to-r from-primary-600 to-orange-500 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Download the FoodHub App</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">Get exclusive deals and track your orders on the go</p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-dark-900 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">App Store</button>
            <button className="bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30">Google Play</button>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Home;
