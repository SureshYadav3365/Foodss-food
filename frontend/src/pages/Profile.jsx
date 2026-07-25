import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { IoPerson, IoMail, IoCall, IoLocation, IoAdd, IoTrash } from 'react-icons/io5';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import { authAPI } from '../api';
import { updateUser } from '../store/slices/authSlice';

const ProfileContent = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' });
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile({ name: form.name, phone: form.phone });
      dispatch(updateUser(data.data));
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddresses = async () => {
    try {
      const { data } = await authAPI.updateAddresses({ addresses });
      dispatch(updateUser({ addresses: data.data }));
      toast.success('Addresses saved');
    } catch {
      toast.error('Failed to save addresses');
    }
  };

  const addAddress = () => {
    setAddresses([...addresses, { label: 'Home', street: '', city: '', state: '', pincode: '', isDefault: false }]);
  };

  const removeAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-6">My Profile</h1>

        <div className="card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <IoPerson className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">{user?.name}</h2>
              <span className="badge bg-primary-100 text-primary-700 capitalize">{user?.role}</span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input label="Full Name" icon={<IoPerson />} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" icon={<IoMail />} value={form.email} disabled />
            <Input label="Phone" icon={<IoCall />} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Button type="submit" loading={loading}>Save Changes</Button>
          </form>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg flex items-center gap-2"><IoLocation className="text-primary-600" /> Saved Addresses</h3>
            <Button variant="outline" size="sm" onClick={addAddress}><IoAdd className="inline mr-1" /> Add</Button>
          </div>

          <div className="space-y-4">
            {addresses.map((addr, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <Input label="Label" value={addr.label} onChange={(e) => { const a = [...addresses]; a[i].label = e.target.value; setAddresses(a); }} />
                  <button onClick={() => removeAddress(i)} className="text-red-500 p-2 mt-6"><IoTrash /></button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input label="Street" value={addr.street} onChange={(e) => { const a = [...addresses]; a[i].street = e.target.value; setAddresses(a); }} className="sm:col-span-2" />
                  <Input label="City" value={addr.city} onChange={(e) => { const a = [...addresses]; a[i].city = e.target.value; setAddresses(a); }} />
                  <Input label="Pincode" value={addr.pincode} onChange={(e) => { const a = [...addresses]; a[i].pincode = e.target.value; setAddresses(a); }} />
                </div>
                <label className="flex items-center gap-2 mt-2 text-sm">
                  <input type="checkbox" checked={addr.isDefault} onChange={(e) => { const a = [...addresses]; a[i].isDefault = e.target.checked; setAddresses(a); }} />
                  Default address
                </label>
              </div>
            ))}
          </div>

          {addresses.length > 0 && (
            <Button onClick={handleSaveAddresses} className="mt-4">Save Addresses</Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

const Profile = () => (
  <ProtectedRoute>
    <ProfileContent />
  </ProtectedRoute>
);

export default Profile;
