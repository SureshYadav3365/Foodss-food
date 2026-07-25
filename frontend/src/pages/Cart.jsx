import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IoAdd, IoRemove, IoTrash, IoArrowForward } from 'react-icons/io5';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import VegBadge from '../components/common/VegBadge';
import { updateQuantity, removeFromCart, selectCartSubtotal } from '../store/slices/cartSlice';
import { formatPrice, getEffectivePrice, FOOD_IMAGES } from '../utils/constants';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, discount } = useSelector((state) => state.cart);
  const subtotal = useSelector(selectCartSubtotal);
  const deliveryFee = items.length > 0 ? 40 : 0;
  const total = subtotal + deliveryFee - discount;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <span className="text-7xl">🛒</span>
          <h2 className="font-display text-2xl font-bold mt-4">Your cart is empty</h2>
          <p className="text-dark-500 mt-2">Add some delicious food to get started</p>
          <Link to="/restaurants" className="btn-primary inline-block mt-6">Browse Restaurants</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-6">Your Cart</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.food._id} className="card p-4 flex gap-4">
                <img src={item.food.image || FOOD_IMAGES.default} alt={item.food.name} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <VegBadge isVeg={item.food.isVeg} />
                    <h3 className="font-semibold">{item.food.name}</h3>
                  </div>
                  <p className="text-primary-600 font-bold mt-1">{formatPrice(getEffectivePrice(item.food))}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-0.5">
                      <button onClick={() => dispatch(updateQuantity({ foodId: item.food._id, quantity: item.quantity - 1 }))} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white">
                        <IoRemove className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ foodId: item.food._id, quantity: item.quantity + 1 }))} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white">
                        <IoAdd className="w-4 h-4" />
                      </button>
                    </div>
                    <button onClick={() => dispatch(removeFromCart(item.food._id))} className="text-red-500 hover:text-red-600 p-1">
                      <IoTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-bold text-dark-900">{formatPrice(getEffectivePrice(item.food) * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="card p-6 h-fit sticky top-24">
            <h3 className="font-display font-bold text-lg mb-4">Bill Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-dark-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-dark-500">Delivery Fee</span><span>{formatPrice(deliveryFee)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link to="/checkout" className="block mt-6">
              <Button className="w-full flex items-center justify-center gap-2">
                Proceed to Checkout <IoArrowForward />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
