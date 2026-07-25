import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  IoLocation, 
  IoCard, 
  IoCheckmarkCircle, 
  IoChevronBackOutline, 
  IoBicycleOutline,
  IoFastFoodOutline 
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import { clearCart, applyCoupon, removeCoupon, selectCartSubtotal } from '../store/slices/cartSlice';
import { orderAPI, couponAPI } from '../api';
import { PAYMENT_METHODS, formatPrice } from '../utils/constants';

const CheckoutContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, coupon, discount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const subtotal = useSelector(selectCartSubtotal);
  const deliveryFee = 40;
  const total = subtotal + deliveryFee - discount;

  const [address, setAddress] = useState(user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || {
    label: 'Home', street: '', city: 'Nagal Koju', state: 'Rajasthan', pincode: '303007',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Success Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

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
      setSuccessOrder(data.data);
      dispatch(clearCart());
      setShowSuccessModal(true);
      toast.success('Order placed successfully!');
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

  if (items.length === 0 && !showSuccessModal) {
    navigate('/cart');
    return null;
  }

  return (
    <Layout>
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${showSuccessModal ? 'filter blur-[3px] select-none pointer-events-none' : ''}`}>
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

      {/* Online Payment Modal */}
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

      {/* Order Confirmed Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-dark-800 rounded-3xl p-8 max-w-lg w-full text-center relative shadow-2xl border border-gray-100 dark:border-dark-700/60 transition-all animate-scale-up">
            
            {/* Confetti Celebration Particles */}
            <div className="absolute top-8 left-12 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
            <div className="absolute top-16 right-16 w-3 h-3 bg-blue-400 rounded-full animate-bounce" />
            <div className="absolute bottom-16 left-20 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <div className="absolute bottom-24 right-12 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />

            {/* Checkmark Icon */}
            <div className="w-20 h-20 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/60 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400 text-4xl shadow-md mb-6 relative">
              ✔
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-display font-black text-dark-900 dark:text-white tracking-tight mb-1">
              Order Confirmed!
            </h2>
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
              Payment Successful!
            </p>
            <p className="text-[10px] text-dark-400 dark:text-dark-500 mb-6 font-medium">
              Transaction ID: TXN-FH-{successOrder?._id?.substring(0, 8).toUpperCase() || '98765-ABC'}
            </p>

            {/* Order On Its Way Section */}
            <div className="bg-slate-50 dark:bg-dark-900 border border-gray-100 dark:border-dark-750/80 rounded-2xl p-5 text-left mb-8">
              <h3 className="font-display font-extrabold text-sm text-dark-900 dark:text-white flex items-center gap-2 mb-4">
                <IoBicycleOutline className="w-5 h-5 text-primary-500" /> Your Order is on its way!
              </h3>
              
              {/* Order item details */}
              <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100 dark:border-dark-750">
                <span className="text-dark-600 dark:text-dark-300 flex items-center gap-1.5 font-medium">
                  <IoFastFoodOutline className="w-4 h-4 text-amber-500" /> Double Smash Burger x3
                </span>
                <span className="font-bold text-dark-900 dark:text-white">₹897</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100 dark:border-dark-750">
                <span className="text-dark-400">Delivery Fee</span>
                <span className="text-dark-600 dark:text-dark-400 font-semibold">₹40</span>
              </div>
              <div className="flex items-center justify-between text-base font-extrabold text-dark-900 dark:text-white pt-3">
                <span>Total Paid</span>
                <span>₹937</span>
              </div>

              {/* Delivery stats */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 dark:border-dark-750 pt-3 text-xs gap-2">
                <span className="text-dark-400 font-medium">
                  Order ID: <span className="font-bold text-dark-700 dark:text-dark-300">#FH-98765</span>
                </span>
                <span className="text-primary-600 dark:text-primary-400 font-bold">
                  ⏱ Est. Delivery: 25-30 mins
                </span>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate(`/orders/${successOrder?._id}`)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-extrabold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm active:scale-98"
              >
                Track My Order
              </button>
              <button 
                onClick={() => navigate(`/orders/${successOrder?._id}`)}
                className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-dark-900 dark:hover:bg-dark-750 text-dark-600 dark:text-dark-300 font-bold py-3 px-6 rounded-xl transition-all duration-200 text-sm border border-gray-100 dark:border-dark-700 active:scale-98"
              >
                Live Tracking
              </button>
            </div>

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
