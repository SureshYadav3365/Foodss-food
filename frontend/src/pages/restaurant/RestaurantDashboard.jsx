import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoAdd, IoCreate, IoTrash, IoReceipt } from 'react-icons/io5';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import { restaurantAPI, foodAPI, orderAPI } from '../../api';
import { ORDER_STATUS, formatPrice } from '../../utils/constants';

const RestaurantDashboardContent = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders');
  const [modal, setModal] = useState({ open: false, data: {} });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [restRes, orderRes, statsRes] = await Promise.all([
        restaurantAPI.getMy(),
        orderAPI.getAll(),
        orderAPI.getStats(),
      ]);
      setRestaurant(restRes.data.data);
      setOrders(orderRes.data.data);
      setStats(statsRes.data.data);

      const foodRes = await foodAPI.getAll({ restaurant: restRes.data.data._id, limit: 50 });
      setFoods(foodRes.data.data.foods);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSaveFood = async () => {
    try {
      const data = { ...modal.data, restaurant: restaurant._id };
      if (data._id) await foodAPI.update(data._id, data);
      else await foodAPI.create(data);
      toast.success('Food item saved');
      setModal({ open: false, data: {} });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDeleteFood = async (id) => {
    if (!confirm('Delete this food item?')) return;
    try {
      await foodAPI.delete(id);
      toast.success('Deleted');
      fetchAll();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, { status });
      toast.success('Status updated');
      fetchAll();
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Layout><Loader fullScreen /></Layout>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">{restaurant?.name || 'Restaurant Dashboard'}</h1>
            <p className="text-dark-500">Manage your restaurant, menu & orders</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-5">
            <p className="text-sm text-dark-500">Total Orders</p>
            <p className="text-2xl font-bold mt-1">{stats.totalOrders || 0}</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-dark-500">Total Revenue</p>
            <p className="text-2xl font-bold mt-1">{formatPrice(stats.totalRevenue || 0)}</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-dark-500">Menu Items</p>
            <p className="text-2xl font-bold mt-1">{foods.length}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['orders', 'menu'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-dark-600'}`}>
              {t === 'orders' ? 'Orders' : 'Menu Items'}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 card"><IoReceipt className="w-12 h-12 text-gray-300 mx-auto" /><p className="text-dark-500 mt-2">No orders yet</p></div>
            ) : orders.map((order) => (
              <div key={order._id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-dark-500">{order.user?.name} • {order.items?.length} items • {formatPrice(order.total)}</p>
                    <span className={`badge ${ORDER_STATUS[order.status]?.color} mt-2 inline-block`}>{ORDER_STATUS[order.status]?.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['confirmed', 'preparing', 'out_for_delivery', 'delivered'].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(order._id, s)}
                        disabled={order.status === s || order.status === 'delivered' || order.status === 'cancelled'}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${order.status === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-dark-600 hover:bg-gray-200 disabled:opacity-40'}`}
                      >
                        {ORDER_STATUS[s]?.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'menu' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="font-display font-bold">Menu Items</h2>
              <Button size="sm" onClick={() => setModal({ open: true, data: { name: '', price: 0, isVeg: true } })}>
                <IoAdd className="inline mr-1" /> Add Item
              </Button>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="text-left p-4">Name</th><th className="text-left p-4">Price</th><th className="text-left p-4">Type</th><th className="p-4">Actions</th></tr></thead>
                <tbody>
                  {foods.map((f) => (
                    <tr key={f._id} className="border-t border-gray-50">
                      <td className="p-4 font-medium">{f.name}</td>
                      <td className="p-4">₹{f.price}</td>
                      <td className="p-4">{f.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}</td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => setModal({ open: true, data: { ...f } })} className="text-blue-600"><IoCreate /></button>
                        <button onClick={() => handleDeleteFood(f._id)} className="text-red-600"><IoTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, data: {} })} title={modal.data._id ? 'Edit Food Item' : 'Add Food Item'}>
        <div className="space-y-4">
          <Input label="Name" value={modal.data.name || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, name: e.target.value } })} />
          <Input label="Price" type="number" value={modal.data.price || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, price: Number(e.target.value) } })} />
          <Input label="Description" value={modal.data.description || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, description: e.target.value } })} />
          <Input label="Image URL" value={modal.data.image || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, image: e.target.value } })} />
          <label className="flex items-center gap-2"><input type="checkbox" checked={modal.data.isVeg} onChange={(e) => setModal({ ...modal, data: { ...modal.data, isVeg: e.target.checked } })} /> Vegetarian</label>
          <Button onClick={handleSaveFood} className="w-full">Save</Button>
        </div>
      </Modal>
    </Layout>
  );
};

const RestaurantDashboard = () => (
  <ProtectedRoute roles={['restaurant']}>
    <RestaurantDashboardContent />
  </ProtectedRoute>
);

export default RestaurantDashboard;
