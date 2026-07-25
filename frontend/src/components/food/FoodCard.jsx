import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { IoAdd, IoHeart, IoHeartOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import VegBadge from '../common/VegBadge';
import StarRating from '../common/StarRating';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../../store/slices/wishlistSlice';
import { formatPrice, getEffectivePrice, FOOD_IMAGES } from '../../utils/constants';

const FoodCard = ({ food, index = 0, showRestaurant = true }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isInWishlist = useSelector(selectIsInWishlist(food._id));

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ food, quantity: 1 }));
    toast.success(`${food.name} added to cart`);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    dispatch(toggleWishlist({ foodId: food._id, isInWishlist }));
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const price = getEffectivePrice(food);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/food/${food._id}`} className="card group block">
        <div className="relative h-40 overflow-hidden">
          <img
            src={food.image || FOOD_IMAGES.default}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            {isInWishlist ? <IoHeart className="w-4 h-4 text-primary-600" /> : <IoHeartOutline className="w-4 h-4 text-dark-500" />}
          </button>
          {food.discountPrice && (
            <span className="absolute top-3 left-3 badge bg-green-500 text-white font-semibold">
              {Math.round(((food.price - food.discountPrice) / food.price) * 100)}% OFF
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <VegBadge isVeg={food.isVeg} />
                <h3 className="font-semibold text-dark-900 truncate">{food.name}</h3>
              </div>
              {showRestaurant && food.restaurant && (
                <p className="text-xs text-dark-400 mt-1 truncate">{food.restaurant.name}</p>
              )}
            </div>
            <StarRating rating={food.rating} />
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-dark-900">{formatPrice(price)}</span>
              {food.discountPrice && (
                <span className="text-sm text-dark-400 line-through">{formatPrice(food.price)}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1 bg-primary-50 hover:bg-primary-600 hover:text-white text-primary-600 font-semibold text-sm py-1.5 px-3 rounded-lg transition-all duration-200"
            >
              <IoAdd className="w-4 h-4" /> Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default FoodCard;
