import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IoSearch, IoFilter } from 'react-icons/io5';
import Layout from '../components/layout/Layout';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import Loader from '../components/common/Loader';
import { restaurantAPI, categoryAPI } from '../api';
import { CUISINES } from '../utils/constants';

const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    cuisine: searchParams.get('cuisine') || '',
    sort: searchParams.get('sort') || '',
    category: searchParams.get('category') || '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    categoryAPI.getAll().then((res) => setCategories(res.data.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const params = { limit: 20 };
        if (search) params.search = search;
        if (filters.cuisine) params.cuisine = filters.cuisine;
        if (filters.sort) params.sort = filters.sort;
        const { data } = await restaurantAPI.getAll(params);
        setRestaurants(data.data.restaurants);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [search, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-2">Restaurants Near You</h1>
        <p className="text-dark-500 mb-6">Discover amazing food from top restaurants</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12"
            />
          </form>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2">
            <IoFilter /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="card p-4 mb-6 flex flex-wrap gap-4 animate-slide-up">
            <select className="input-field w-auto" value={filters.cuisine} onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}>
              <option value="">All Cuisines</option>
              {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input-field w-auto" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
              <option value="">Sort By</option>
              <option value="rating">Rating</option>
              <option value="delivery">Delivery Time</option>
            </select>
            <select className="input-field w-auto" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
        )}

        {loading ? (
          <Loader />
        ) : restaurants.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl">🔍</span>
            <p className="text-dark-500 mt-4 text-lg">No restaurants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r, i) => <RestaurantCard key={r._id} restaurant={r} index={i} />)}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Restaurants;
