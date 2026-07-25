import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { IoLocation, IoCard, IoCheckmarkCircle } from 'react-icons/io5';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import { orderAPI, couponAPI } from '../api';
import { clearCart, applyCoupon, removeCoupon, selectCartSubtotal } from '../store/slices/cartSlice';
import { formatPrice, PAYMENT_METHODS } from '../utils/constants';

const CheckoutContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, coupon, discount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const subtotal = useSelector(selectCartSubtotal);
  const deliveryFee = 40;
  const total = subtotal + deliveryFee - discount;

  const [address, setAddress] = useState(user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || {
    label: 'Home', street: '', city: 'Mumbai', state: 'Maharashtra', pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const { data } = await couponAPI.validate(couponCode, subtotal);
      dispatch(applyCoupon({ coupon: data.data.coupon, discount: data.data.discount }));
      toast.success('Coupon applied!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.street || !address.pincode) {
      toast.error('Please fill in delivery address');
      return;
    }

    if (paymentMethod !== 'cod') {
      setShowPayment(true);
      return;
    }

    await submitOrder();
  };

  const submitOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map((i) => ({ food: i.food._id, quantity: i.quantity })),
        deliveryAddress: address,
        paymentMethod,
        couponCode: coupon?.code || '',
      };
      const { data } = await orderAPI.create(orderData);
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
      setShowPayment(false);
    }
  };

  const handleOnlinePayment = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      submitOrder();
    }, 2000);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-6">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="font-display font-bold text-lg flex items-center gap-2 mb-4">
                <IoLocation className="text-primary-600" /> Delivery Address
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Label" value={address.label} onChange={(e) => setAddress({ ...address, label: e.target.value })} />
                <Input label="Street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="sm:col-span-2" />
                <Input label="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                <Input label="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-display font-bold text-lg flex items-center gap-2 mb-4">
                <IoCard className="text-primary-600" /> Payment Method
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === pm.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <span className="text-2xl">{pm.icon}</span>
                    <p className="font-semibold mt-2 text-sm">{pm.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-display font-bold text-lg mb-4">Apply Coupon</h3>
              <div className="flex gap-3">
                <Input placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} className="flex-1" />
                <Button variant="outline" onClick={handleApplyCoupon}>Apply</Button>
              </div>
              {coupon && (
                <div className="mt-3 flex items-center justify-between bg-green-50 p-3 rounded-xl">
                  <span className="text-green-700 font-medium flex items-center gap-2"><IoCheckmarkCircle /> {coupon.code} applied</span>
                  <button onClick={() => dispatch(removeCoupon())} className="text-red-500 text-sm">Remove</button>
                </div>
              )}
              <p className="text-xs text-dark-400 mt-2">Try: WELCOME50, FLAT100, FOODIE20</p>
            </div>
          </div>

          <div className="card p-6 h-fit sticky top-24">
            <h3 className="font-display font-bold text-lg mb-4">Order Summary</h3>
            {items.map((item) => (
              <div key={item.food._id} className="flex justify-between text-sm py-2 border-b border-gray-50">
                <span className="text-dark-600">{item.food.name} x{item.quantity}</span>
                <span className="font-medium">{formatPrice((item.food.discountPrice || item.food.price) * item.quantity)}</span>
              </div>
            ))}
            <div className="space-y-2 mt-4 text-sm">
              <div className="flex justify-between"><span className="text-dark-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-dark-500">Delivery</span><span>{formatPrice(deliveryFee)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
              <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
            <Button onClick={handlePlaceOrder} loading={loading} className="w-full mt-6">
              Place Order — {formatPrice(total)}
            </Button>
          </div>
        </div>
      </div>

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-slide-up">
            {paymentProcessing ? (
              <>
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
                <p className="mt-4 font-semibold text-lg">Processing Payment...</p>
                <p className="text-dark-500 text-sm mt-1">Please wait</p>
              </>
            ) : (
              <>
                <IoCard className="w-12 h-12 text-primary-600 mx-auto" />
                <h3 className="font-display font-bold text-xl mt-4">Payment Gateway</h3>
                <p className="text-dark-500 mt-2">Amount: {formatPrice(total)}</p>
                <div className="mt-6 space-y-3">
                  <Input placeholder="Card Number" defaultValue="4111 1111 1111 1111" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="MM/YY" defaultValue="12/28" />
                    <Input placeholder="CVV" defaultValue="123" />
                  </div>
                  <Button onClick={handleOnlinePayment} className="w-full mt-4">Pay {formatPrice(total)}</Button>
                  <button onClick={() => setShowPayment(false)} className="text-sm text-dark-500 hover:text-dark-700">Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

const Checkout = () => (
  <ProtectedRoute>
    <CheckoutContent />
  </ProtectedRoute>
);

export default Checkout;
