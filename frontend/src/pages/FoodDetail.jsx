import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { IoAdd, IoRemove, IoArrowBack } from 'react-icons/io5';
import Layout from '../components/layout/Layout';
import Loader from '../components/common/Loader';
import VegBadge from '../components/common/VegBadge';
import StarRating from '../components/common/StarRating';
import Button from '../components/common/Button';
import { foodAPI, reviewAPI } from '../api';
import { addToCart, updateQuantity } from '../store/slices/cartSlice';
import { formatPrice, getEffectivePrice, FOOD_IMAGES } from '../utils/constants';

const FoodDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const cartItem = cartItems.find((i) => i.food._id === id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodRes, reviewRes] = await Promise.all([
          foodAPI.getById(id),
          reviewAPI.getAll({ food: id }),
        ]);
        setFood(foodRes.data.data);
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
  if (!food) return <Layout><div className="text-center py-20">Food not found</div></Layout>;

  const price = getEffectivePrice(food);

  const handleAddToCart = () => {
    dispatch(addToCart({ food, quantity }));
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={food.restaurant ? `/restaurants/${food.restaurant._id}` : '/restaurants'} className="inline-flex items-center gap-2 text-dark-500 hover:text-primary-600 mb-6 transition-colors">
          <IoArrowBack /> Back to restaurant
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
            <img src={food.image || FOOD_IMAGES.default} alt={food.name} className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-lg" />
            {food.discountPrice && (
              <span className="absolute top-4 left-4 badge bg-green-500 text-white font-bold text-sm px-3 py-1">
                {Math.round(((food.price - food.discountPrice) / food.price) * 100)}% OFF
              </span>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <VegBadge isVeg={food.isVeg} />
              {food.tags?.map((t) => <span key={t} className="badge bg-primary-100 text-primary-700 capitalize">{t}</span>)}
            </div>
            <h1 className="font-display text-3xl font-bold text-dark-900">{food.name}</h1>
            {food.restaurant && (
              <Link to={`/restaurants/${food.restaurant._id}`} className="text-primary-600 hover:underline mt-1 inline-block">
                {food.restaurant.name}
              </Link>
            )}
            <div className="flex items-center gap-4 mt-3">
              <StarRating rating={food.rating} size="md" />
              <span className="text-sm text-dark-500">({food.reviewCount} reviews)</span>
            </div>
            <p className="text-dark-600 mt-4 leading-relaxed">{food.description}</p>

            <div className="flex items-center gap-3 mt-6">
              <span className="text-3xl font-bold text-dark-900">{formatPrice(price)}</span>
              {food.discountPrice && <span className="text-lg text-dark-400 line-through">{formatPrice(food.price)}</span>}
            </div>

            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white transition-colors">
                  <IoRemove />
                </button>
                <span className="w-8 text-center font-bold">{cartItem?.quantity || quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white transition-colors">
                  <IoAdd />
                </button>
              </div>
              <Button onClick={handleAddToCart} className="flex-1">
                Add to Cart — {formatPrice(price * (cartItem?.quantity || quantity))}
              </Button>
            </div>
          </motion.div>
        </div>

        {reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-display font-bold mb-4">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div key={r._id} className="card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">{r.user?.name?.[0]}</div>
                    <div>
                      <p className="font-semibold text-sm">{r.user?.name}</p>
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

export default FoodDetail;
