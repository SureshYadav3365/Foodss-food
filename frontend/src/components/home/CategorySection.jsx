import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategorySection = ({ categories }) => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h2 className="section-title mb-2">What's on your mind?</h2>
    <p className="text-dark-500 mb-8">Explore cuisines and categories</p>
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
      {categories.map((cat, i) => (
        <motion.div
          key={cat._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
        >
          <Link
            to={`/restaurants?category=${cat._id}`}
            className="flex flex-col items-center gap-3 min-w-[100px] group"
          >
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <span className="text-sm font-medium text-dark-700 group-hover:text-primary-600 transition-colors text-center">
              {cat.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

export default CategorySection;
