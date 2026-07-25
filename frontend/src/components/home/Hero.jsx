import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoSearch, IoLocation } from 'react-icons/io5';

const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-orange-600 text-white">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
    </div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Hungry? We've got <span className="text-yellow-300">food</span> covered
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-lg">
            Order from the best restaurants near you. Fast delivery, amazing food, unbeatable prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <div className="relative flex-1">
              <IoLocation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your location"
                defaultValue="Mumbai, Maharashtra"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-dark-800 outline-none"
              />
            </div>
            <Link to="/restaurants" className="bg-yellow-400 hover:bg-yellow-300 text-dark-900 font-bold py-3.5 px-8 rounded-xl transition-colors text-center flex items-center justify-center gap-2">
              <IoSearch className="w-5 h-5" /> Find Food
            </Link>
          </div>
          <div className="flex gap-8 mt-10">
            {[{ n: '500+', l: 'Restaurants' }, { n: '10K+', l: 'Dishes' }, { n: '30 min', l: 'Avg Delivery' }].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-bold">{s.n}</p>
                <p className="text-sm text-white/70">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex justify-center"
        >
          <div className="relative">
            <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-[120px] animate-bounce-soft">🍕</span>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-xl"
            >
              <span className="text-3xl">🍔</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-xl"
            >
              <span className="text-3xl">🍜</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
