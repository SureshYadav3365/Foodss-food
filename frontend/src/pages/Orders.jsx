import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoTime, IoChevronForward } from 'react-icons/io5';
import Layout from '../components/layout/Layout';
import Loader from '../components/common/Loader';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import { orderAPI } from '../api';
import { ORDER_STATUS, formatPrice } from '../utils/constants';

const OrdersContent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getAll()
      .then((res) => {
        const data = res.data.data;
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-6">Order History</h1>

        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl">📦</span>
            <p className="text-dark-500 mt-4 text-lg">No orders yet</p>
            <Link to="/restaurants" className="btn-primary inline-block mt-4">Order Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = ORDER_STATUS[order.status] || ORDER_STATUS.placed;
              return (
                <Link key={order._id} to={`/orders/${order._id}`} className="card p-5 flex items-center gap-4 hover:shadow-lg transition-shadow block">
                  <img src={order.restaurant?.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-dark-900 truncate">{order.restaurant?.name}</h3>
                    <p className="text-sm text-dark-500 mt-0.5">{order.items?.length} items • {formatPrice(order.total)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`badge ${status.color}`}>{status.label}</span>
                      <span className="text-xs text-dark-400 flex items-center gap-1">
                        <IoTime className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <IoChevronForward className="w-5 h-5 text-dark-400" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

const Orders = () => (
  <ProtectedRoute>
    <OrdersContent />
  </ProtectedRoute>
);

export default Orders;
