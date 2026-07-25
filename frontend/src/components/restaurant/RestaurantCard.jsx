import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoTime, IoStar } from 'react-icons/io5';
import { FOOD_IMAGES } from '../../utils/constants';

const RestaurantCard = ({ restaurant, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08 }}
  >
    <Link to={`/restaurants/${restaurant._id}`} className="card group block">
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image || FOOD_IMAGES.restaurant}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FOOD_IMAGES.restaurant;
          }}
        />
        {restaurant.isFeatured && (
          <span className="absolute top-3 left-3 badge bg-yellow-400 text-yellow-900 font-semibold">Featured</span>
        )}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <IoStar className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-sm font-bold">{restaurant.rating?.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display font-bold text-lg text-dark-900 group-hover:text-primary-600 transition-colors truncate">
          {restaurant.name}
        </h3>
        <p className="text-sm text-dark-500 truncate mt-1">{restaurant.cuisine?.join(', ')}</p>
        <div className="flex items-center justify-between mt-3 text-sm text-dark-500">
          <span className="flex items-center gap-1">
            <IoTime className="w-4 h-4" /> {restaurant.deliveryTime}
          </span>
          <span>₹{restaurant.deliveryFee} delivery</span>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default RestaurantCard;
