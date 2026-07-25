import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoTime, IoLocation, IoStar } from 'react-icons/io5';
import Layout from '../components/layout/Layout';
import FoodCard from '../components/food/FoodCard';
import Loader from '../components/common/Loader';
import StarRating from '../components/common/StarRating';
import { restaurantAPI, foodAPI, reviewAPI } from '../api';
import { FOOD_IMAGES } from '../utils/constants';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, foodRes, reviewRes] = await Promise.all([
          restaurantAPI.getById(id),
          foodAPI.getAll({ restaurant: id }),
          reviewAPI.getAll({ restaurant: id }),
        ]);
        setRestaurant(restRes.data.data);
        setFoods(foodRes.data.data.foods);
        setReviews(reviewRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Layout><Loader fullScreen /></Layout>;
  if (!restaurant) return <Layout><div className="text-center py-20">Restaurant not found</div></Layout>;

  const filteredFoods = filter === 'veg' ? foods.filter((f) => f.isVeg) : filter === 'nonveg' ? foods.filter((f) => !f.isVeg) : foods;

  return (
    <Layout>
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={restaurant.coverImage || restaurant.image || FOOD_IMAGES.restaurant} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold">{restaurant.name}</h1>
            <p className="text-white/80 mt-2">{restaurant.cuisine?.join(' • ')}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1"><IoStar className="text-yellow-400" /> {restaurant.rating?.toFixed(1)} ({restaurant.reviewCount} reviews)</span>
              <span className="flex items-center gap-1"><IoTime /> {restaurant.deliveryTime}</span>
              <span className="flex items-center gap-1"><IoLocation /> {restaurant.address}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-dark-600 mb-6">{restaurant.description}</p>

        <div className="flex gap-3 mb-6">
          {['all', 'veg', 'nonveg'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-dark-600 hover:bg-gray-200'}`}
            >
              {f === 'all' ? 'All' : f === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-display font-bold mb-4">Menu ({filteredFoods.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFoods.map((f, i) => <FoodCard key={f._id} food={{ ...f, restaurant }} index={i} showRestaurant={false} />)}
        </div>

        {reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-display font-bold mb-4">Reviews</h2>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600">
                      {r.user?.name?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{r.user?.name}</p>
                      <StarRating rating={r.rating} size="sm" />
                    </div>
                  </div>
                  <p className="text-dark-600 text-sm">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RestaurantDetail;
