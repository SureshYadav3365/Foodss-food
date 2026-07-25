import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle, IoLocation, IoArrowBack } from 'react-icons/io5';
import Layout from '../components/layout/Layout';
import Loader from '../components/common/Loader';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import { orderAPI } from '../api';
import { ORDER_STATUS, formatPrice } from '../utils/constants';

const STATUS_STEPS = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

const OrderTrackingContent = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getById(id)
      .then((res) => setOrder(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout><Loader fullScreen /></Layout>;
  if (!order) return <Layout><div className="text-center py-20">Order not found</div></Layout>;

  const currentStep = ORDER_STATUS[order.status]?.step ?? 0;
  const isCancelled = order.status === 'cancelled';

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/orders" className="inline-flex items-center gap-2 text-dark-500 hover:text-primary-600 mb-6">
          <IoArrowBack /> Back to orders
        </Link>

        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-xl font-bold">Order #{order._id.slice(-6).toUpperCase()}</h1>
              <p className="text-dark-500 text-sm mt-1">{order.restaurant?.name}</p>
            </div>
            <span className={`badge ${ORDER_STATUS[order.status]?.color} text-sm px-3 py-1`}>
              {ORDER_STATUS[order.status]?.label}
            </span>
          </div>

          {!isCancelled && (
            <div className="relative mt-8 mb-4">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                  className="h-full bg-primary-600 rounded"
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="relative flex justify-between">
                {STATUS_STEPS.map((step, i) => {
                  const isCompleted = i <= currentStep;
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${isCompleted ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {isCompleted ? <IoCheckmarkCircle className="w-5 h-5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                      </div>
                      <span className={`text-xs mt-2 text-center max-w-[70px] ${isCompleted ? 'text-primary-600 font-medium' : 'text-dark-400'}`}>
                        {ORDER_STATUS[step]?.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {order.estimatedDelivery && !isCancelled && (
            <p className="text-center text-sm text-dark-500 mt-4">
              Estimated delivery: {new Date(order.estimatedDelivery).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>

        <div className="card p-6 mb-6">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2"><IoLocation className="text-primary-600" /> Delivery Address</h3>
          <p className="text-dark-600">{order.deliveryAddress?.street}</p>
          <p className="text-dark-500 text-sm">{order.deliveryAddress?.city}, {order.deliveryAddress?.pincode}</p>
        </div>

        <div className="card p-6">
          <h3 className="font-display font-bold mb-4">Order Items</h3>
          {order.items?.map((item) => (
            <div key={item._id || item.food} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
              <span className="text-dark-700">{item.name} x{item.quantity}</span>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-dark-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-dark-500">Delivery</span><span>{formatPrice(order.deliveryFee)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const OrderTracking = () => (
  <ProtectedRoute>
    <OrderTrackingContent />
  </ProtectedRoute>
);

export default OrderTracking;
