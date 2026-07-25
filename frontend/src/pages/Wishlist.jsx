import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import FoodCard from '../components/food/FoodCard';
import Loader from '../components/common/Loader';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import { fetchWishlist } from '../store/slices/wishlistSlice';

const WishlistContent = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-6">My Wishlist</h1>

        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl">❤️</span>
            <p className="text-dark-500 mt-4 text-lg">Your wishlist is empty</p>
            <Link to="/restaurants" className="btn-primary inline-block mt-4">Explore Food</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((food, i) => <FoodCard key={food._id} food={food} index={i} />)}
          </div>
        )}
      </div>
    </Layout>
  );
};

const Wishlist = () => (
  <ProtectedRoute>
    <WishlistContent />
  </ProtectedRoute>
);

export default Wishlist;
