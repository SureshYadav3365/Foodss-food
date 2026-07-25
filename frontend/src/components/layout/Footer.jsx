import { Link } from 'react-router-dom';
import { IoLogoInstagram, IoLogoTwitter, IoLogoFacebook } from 'react-icons/io5';

const Footer = () => (
  <footer className="bg-dark-900 text-gray-300 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🍔</span>
            <span className="font-display font-bold text-xl text-white">FoodHub</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Order food from the best restaurants near you. Fast delivery, great taste, every time.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
            <li><Link to="/restaurants" className="hover:text-primary-400 transition-colors">Restaurants</Link></li>
            <li><Link to="/offers" className="hover:text-primary-400 transition-colors">Offers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact Support</Link></li>
            <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Help Center</Link></li>
            <li><Link to="/about" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Follow Us</h4>
          <div className="flex gap-3">
            {[IoLogoInstagram, IoLogoTwitter, IoLogoFacebook].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 bg-dark-800 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-dark-700 mt-8 pt-8 text-center text-sm text-gray-500">
        © 2026 FoodHub. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
