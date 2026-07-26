import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { IoPerson, IoMail, IoCall, IoLocation, IoAdd, IoTrash } from 'react-icons/io5';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import { authAPI, uploadAPI } from '../api';
import { updateUser } from '../store/slices/authSlice';

const ProfileContent = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' });
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || '');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '', email: user.email || '' });
      setAddresses(user.addresses || []);
      setPreviewUrl(user.avatar || '');
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type (PNG, JPG, JPEG)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only PNG, JPG, or JPEG images are allowed.');
      return;
    }

    // Validate size (under 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarUrl = user?.avatar || '';

      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const { data: uploadData } = await uploadAPI.uploadImage(formData, 'profile');
        avatarUrl = uploadData.data.url;
      }

      const { data } = await authAPI.updateProfile({ 
        name: form.name, 
        phone: form.phone,
        avatar: avatarUrl
      });
      dispatch(updateUser(data.data));
      toast.success('Profile updated');
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
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

  if (!user) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-6">My Profile</h1>

        <div className="card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />
              <div
                onClick={handleAvatarClick}
                className="relative group cursor-pointer w-16 h-16 rounded-full overflow-hidden border-2 border-primary-200 dark:border-primary-800 shadow-sm transition-all hover:border-primary-500 hover:shadow-md flex items-center justify-center bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <IoPerson className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                )}
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white text-[10px] font-bold tracking-wider uppercase">Upload</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 w-5 h-5 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors focus:outline-none border border-white dark:border-dark-800"
                title="Change profile picture"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
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
