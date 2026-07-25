import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoRestaurant, IoFastFood, IoPeople, IoPricetag, IoAdd, IoTrash, IoCreate } from 'react-icons/io5';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import { restaurantAPI, foodAPI, couponAPI, categoryAPI } from '../../api';
import { CUISINES } from '../../utils/constants';

const AdminDashboardContent = () => {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, type: '', data: {} });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, restRes, foodRes, couponRes, catRes] = await Promise.all([
        restaurantAPI.getStats(),
        restaurantAPI.getAll({ limit: 50 }),
        foodAPI.getAll({ limit: 50 }),
        couponAPI.getAll(),
        categoryAPI.getAll(),
      ]);
      setStats(statsRes.data.data);
      setRestaurants(restRes.data.data.restaurants);
      setFoods(foodRes.data.data.foods);
      setCoupons(couponRes.data.data);
      setCategories(catRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSave = async () => {
    try {
      const { type, data } = modal;
      if (type === 'restaurant') {
        if (data._id) await restaurantAPI.update(data._id, data);
        else await restaurantAPI.create(data);
      } else if (type === 'food') {
        if (data._id) await foodAPI.update(data._id, data);
        else await foodAPI.create(data);
      } else if (type === 'coupon') {
        if (data._id) await couponAPI.update(data._id, data);
        else await couponAPI.create(data);
      } else if (type === 'category') {
        if (data._id) await categoryAPI.update(data._id, data);
        else await categoryAPI.create(data);
      }
      toast.success('Saved successfully');
      setModal({ open: false, type: '', data: {} });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure?')) return;
    try {
      if (type === 'restaurant') await restaurantAPI.delete(id);
      else if (type === 'food') await foodAPI.delete(id);
      else if (type === 'coupon') await couponAPI.delete(id);
      else if (type === 'category') await categoryAPI.delete(id);
      toast.success('Deleted');
      fetchAll();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: IoRestaurant },
    { id: 'restaurants', label: 'Restaurants', icon: IoRestaurant },
    { id: 'foods', label: 'Food Items', icon: IoFastFood },
    { id: 'coupons', label: 'Coupons', icon: IoPricetag },
    { id: 'categories', label: 'Categories', icon: IoPeople },
  ];

  if (loading) return <Layout><Loader fullScreen /></Layout>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-6">Admin Dashboard</h1>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${tab === t.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-dark-600 hover:bg-gray-200'}`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Restaurants', value: stats.totalRestaurants, icon: '🏪', color: 'bg-blue-50 text-blue-600' },
              { label: 'Active Restaurants', value: stats.activeRestaurants, icon: '✅', color: 'bg-green-50 text-green-600' },
              { label: 'Total Food Items', value: stats.totalFoods, icon: '🍕', color: 'bg-orange-50 text-orange-600' },
              { label: 'Active Coupons', value: coupons.filter((c) => c.isActive).length, icon: '🎟️', color: 'bg-purple-50 text-purple-600' },
            ].map((s) => (
              <div key={s.label} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark-500">{s.label}</p>
                    <p className="text-3xl font-bold mt-1">{s.value || 0}</p>
                  </div>
                  <span className={`text-3xl w-14 h-14 rounded-2xl flex items-center justify-center ${s.color}`}>{s.icon}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'restaurants' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="font-display font-bold text-lg">Restaurants ({restaurants.length})</h2>
              <Button size="sm" onClick={() => setModal({ open: true, type: 'restaurant', data: { name: '', cuisine: [], city: 'Nagal Koju', deliveryTime: '30-40 mins', deliveryFee: 40, minOrder: 99 } })}>
                <IoAdd className="inline mr-1" /> Add Restaurant
              </Button>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="text-left p-4">Name</th><th className="text-left p-4 hidden sm:table-cell">Cuisine</th><th className="text-left p-4">Rating</th><th className="text-left p-4">Status</th><th className="p-4">Actions</th></tr></thead>
                <tbody>
                  {restaurants.map((r) => (
                    <tr key={r._id} className="border-t border-gray-50">
                      <td className="p-4 font-medium">{r.name}</td>
                      <td className="p-4 hidden sm:table-cell text-dark-500">{r.cuisine?.join(', ')}</td>
                      <td className="p-4">{r.rating?.toFixed(1)}</td>
                      <td className="p-4"><span className={`badge ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => setModal({ open: true, type: 'restaurant', data: { ...r } })} className="text-blue-600"><IoCreate /></button>
                        <button onClick={() => handleDelete('restaurant', r._id)} className="text-red-600"><IoTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'foods' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="font-display font-bold text-lg">Food Items ({foods.length})</h2>
              <Button size="sm" onClick={() => setModal({ open: true, type: 'food', data: { name: '', price: 0, restaurant: restaurants[0]?._id, isVeg: true } })}>
                <IoAdd className="inline mr-1" /> Add Food
              </Button>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="text-left p-4">Name</th><th className="text-left p-4">Price</th><th className="text-left p-4 hidden sm:table-cell">Restaurant</th><th className="p-4">Actions</th></tr></thead>
                <tbody>
                  {foods.map((f) => (
                    <tr key={f._id} className="border-t border-gray-50">
                      <td className="p-4 font-medium">{f.name}</td>
                      <td className="p-4">₹{f.price}</td>
                      <td className="p-4 hidden sm:table-cell text-dark-500">{f.restaurant?.name}</td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => setModal({ open: true, type: 'food', data: { ...f, restaurant: f.restaurant?._id || f.restaurant } })} className="text-blue-600"><IoCreate /></button>
                        <button onClick={() => handleDelete('food', f._id)} className="text-red-600"><IoTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'coupons' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="font-display font-bold text-lg">Coupons ({coupons.length})</h2>
              <Button size="sm" onClick={() => setModal({ open: true, type: 'coupon', data: { code: '', discountType: 'percentage', discountValue: 10, minOrder: 199, expiryDate: '2027-12-31' } })}>
                <IoAdd className="inline mr-1" /> Add Coupon
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c._id} className="card p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-primary-600 text-lg">{c.code}</p>
                      <p className="text-sm text-dark-500 mt-1">{c.description}</p>
                      <p className="text-sm mt-2">{c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`} • Min ₹{c.minOrder}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setModal({ open: true, type: 'coupon', data: { ...c } })} className="text-blue-600 p-1"><IoCreate /></button>
                      <button onClick={() => handleDelete('coupon', c._id)} className="text-red-600 p-1"><IoTrash /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'categories' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="font-display font-bold text-lg">Categories ({categories.length})</h2>
              <Button size="sm" onClick={() => setModal({ open: true, type: 'category', data: { name: '', slug: '' } })}>
                <IoAdd className="inline mr-1" /> Add Category
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((c) => (
                <div key={c._id} className="card p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-dark-400">{c.slug}</p>
                  </div>
                  <button onClick={() => handleDelete('category', c._id)} className="text-red-600"><IoTrash /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, type: '', data: {} })} title={`${modal.data._id ? 'Edit' : 'Add'} ${modal.type}`}>
        <div className="space-y-4">
          {modal.type === 'restaurant' && (
            <>
              <Input label="Name" value={modal.data.name || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, name: e.target.value } })} />
              <Input label="Description" value={modal.data.description || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, description: e.target.value } })} />
              <Input label="Image URL" value={modal.data.image || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, image: e.target.value } })} />
              <Input label="City" value={modal.data.city || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, city: e.target.value } })} />
              <div>
                <label className="block text-sm font-medium mb-1.5">Cuisine</label>
                <select multiple className="input-field h-24" value={modal.data.cuisine || []} onChange={(e) => setModal({ ...modal, data: { ...modal.data, cuisine: Array.from(e.target.selectedOptions, (o) => o.value) } })}>
                  {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </>
          )}
          {modal.type === 'food' && (
            <>
              <Input label="Name" value={modal.data.name || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, name: e.target.value } })} />
              <Input label="Price" type="number" value={modal.data.price || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, price: Number(e.target.value) } })} />
              <Input label="Description" value={modal.data.description || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, description: e.target.value } })} />
              <Input label="Image URL" value={modal.data.image || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, image: e.target.value } })} />
              <select className="input-field" value={modal.data.restaurant || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, restaurant: e.target.value } })}>
                {restaurants.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
              <label className="flex items-center gap-2"><input type="checkbox" checked={modal.data.isVeg} onChange={(e) => setModal({ ...modal, data: { ...modal.data, isVeg: e.target.checked } })} /> Vegetarian</label>
            </>
          )}
          {modal.type === 'coupon' && (
            <>
              <Input label="Code" value={modal.data.code || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, code: e.target.value.toUpperCase() } })} />
              <Input label="Description" value={modal.data.description || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, description: e.target.value } })} />
              <select className="input-field" value={modal.data.discountType || 'percentage'} onChange={(e) => setModal({ ...modal, data: { ...modal.data, discountType: e.target.value } })}>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
              <Input label="Discount Value" type="number" value={modal.data.discountValue || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, discountValue: Number(e.target.value) } })} />
              <Input label="Min Order" type="number" value={modal.data.minOrder || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, minOrder: Number(e.target.value) } })} />
              <Input label="Expiry Date" type="date" value={modal.data.expiryDate?.split('T')[0] || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, expiryDate: e.target.value } })} />
            </>
          )}
          {modal.type === 'category' && (
            <>
              <Input label="Name" value={modal.data.name || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') } })} />
              <Input label="Slug" value={modal.data.slug || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, slug: e.target.value } })} />
              <Input label="Image URL" value={modal.data.image || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, image: e.target.value } })} />
            </>
          )}
          <Button onClick={handleSave} className="w-full">Save</Button>
        </div>
      </Modal>
    </Layout>
  );
};

const AdminDashboard = () => (
  <ProtectedRoute roles={['admin']}>
    <AdminDashboardContent />
  </ProtectedRoute>
);

export default AdminDashboard;
