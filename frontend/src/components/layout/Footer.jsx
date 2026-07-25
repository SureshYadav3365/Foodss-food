import { Link } from 'react-router-dom';
import { IoLogoInstagram, IoLogoTwitter, IoLogoFacebook, IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success('Successfully subscribed to newsletters!');
    e.target.reset();
  };

  return (
    <footer className="bg-dark-900 text-gray-300 mt-20 border-t border-dark-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-1.5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍔</span>
              <span className="font-display font-bold text-xl text-white">FoodHub</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Order food from the best restaurants near you. Fast delivery, great taste, every time.
            </p>
            {/* Small newsletter subscription */}
            <form onSubmit={handleSubscribe} className="flex max-w-xs rounded-lg overflow-hidden border border-dark-700">
              <input
                type="email"
                required
                placeholder="Subscribe newsletter..."
                className="w-full px-3 py-2 text-xs bg-dark-800 text-white outline-none focus:bg-dark-750 transition-colors"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 text-xs font-bold transition-colors"
              >
                Join
              </button>
            </form>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/restaurants" className="hover:text-primary-400 transition-colors">Restaurants</Link></li>
              <li><Link to="/offers" className="hover:text-primary-400 transition-colors">Offers & Coupons</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/restaurants" className="hover:text-primary-400 transition-colors">Pizza & Italian</Link></li>
              <li><Link to="/restaurants" className="hover:text-primary-400 transition-colors">Burger & Fast Food</Link></li>
              <li><Link to="/restaurants" className="hover:text-primary-400 transition-colors">Biryani & North Indian</Link></li>
              <li><Link to="/restaurants" className="hover:text-primary-400 transition-colors">Chinese & Noodles</Link></li>
              <li><Link to="/restaurants" className="hover:text-primary-400 transition-colors">Dessert & Ice Cream</Link></li>
            </ul>
          </div>

          {/* Contact Information Column */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <IoMailOutline className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@foodhub.com" className="hover:text-primary-400 transition-colors break-all">contact@foodhub.com</a>
              </li>
              <li className="flex items-center gap-2">
                <IoCallOutline className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-primary-400 transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-start gap-2">
                <IoLocationOutline className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span>123 Food Street, Nagal Koju, RJ - 303007</span>
              </li>
            </ul>
          </div>

          {/* Follow & Downloads Column */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Follow Us</h4>
            <div className="flex gap-2.5 mb-6">
              {[
                { icon: IoLogoInstagram, link: '#' },
                { icon: IoLogoTwitter, link: '#' },
                { icon: IoLogoFacebook, link: '#' }
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.link}
                    className="w-9 h-9 bg-dark-800 rounded-lg flex items-center justify-center hover:bg-primary-600 text-white transition-colors"
                  >
                    <IconComp className="w-4.5 h-4.5" />
                  </a>
                );
              })}
            </div>
            
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Download App</h4>
            <div className="flex flex-col gap-2">
              <button className="bg-dark-800 hover:bg-dark-750 text-white py-1.5 px-3 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border border-dark-700/60 justify-center">
                🤖 Google Play
              </button>
              <button className="bg-dark-800 hover:bg-dark-750 text-white py-1.5 px-3 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border border-dark-700/60 justify-center">
                🍎 App Store
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 FoodHub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-gray-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
