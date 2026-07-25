import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategorySection = ({ categories }) => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="mb-8">
      <h2 className="text-2xl md:text-3xl font-display font-extrabold text-dark-900 dark:text-white tracking-tight">
        What's on your mind?
      </h2>
      <p className="text-dark-500 dark:text-dark-400 mt-1">Explore delicious cuisines and quick bites</p>
    </div>
    <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
      {categories.map((cat, i) => (
        <motion.div
          key={cat._id}
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.03 }}
          className="snap-start"
        >
          <Link
            to={`/restaurants?category=${cat._id}`}
            className="flex flex-col items-center gap-3 min-w-[90px] md:min-w-[110px] group"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary-500 shadow-md group-hover:shadow-xl group-hover:scale-108 transition-all duration-300 relative bg-white dark:bg-dark-800">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200';
                }}
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xs md:text-sm font-semibold text-dark-700 dark:text-dark-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-center truncate w-full">
              {cat.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

export default CategorySection;
