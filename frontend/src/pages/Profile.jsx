import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { IoPerson, IoMail, IoCall, IoLocation, IoAdd, IoTrash, IoClose, IoCamera, IoImage } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
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

  // New features state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionSource, setActionSource] = useState('change'); // 'change' or 'upload'

  const menuRef = useRef(null);
  const cameraBtnRef = useRef(null);

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

  // Handle keypresses (Escape key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
        setMenuOpen(false);
        setShowDeleteConfirm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle click outside dropdown menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        cameraBtnRef.current &&
        !cameraBtnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleMenuChangePhoto = () => {
    setActionSource('change');
    setMenuOpen(false);
    fileInputRef.current.click();
  };

  const handleMenuUploadPhoto = () => {
    setActionSource('upload');
    setMenuOpen(false);
    fileInputRef.current.click();
  };

  const handleMenuDeletePhoto = () => {
    setMenuOpen(false);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    dispatch(updateUser({ avatar: null }));
    setPreviewUrl('');
    setShowDeleteConfirm(false);
    toast.success("Profile photo removed successfully.");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type (PNG, JPG, JPEG, WEBP)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      toast.error('Only PNG, JPG, JPEG, or WEBP images are allowed.');
      return;
    }

    // Validate size (under 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    setSelectedFile(file);
    
    // Read file as Base64 to support direct browser preview & storage fallback
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setPreviewUrl(base64Image);
      
      // Save permanently in localStorage & update state instantly
      dispatch(updateUser({ avatar: base64Image }));
      
      toast.success("Profile photo updated successfully.");
      setSelectedFile(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Keep avatar entirely frontend-only.
      // Use previewUrl (which holds the base64 data url from handleFileChange)
      // if a new file has been selected; otherwise preserve existing avatar.
      const avatarUrl = selectedFile ? previewUrl : (user?.avatar || '');

      // Make the profile update request without avatar to prevent payload size errors
      const { data } = await authAPI.updateProfile({ 
        name: form.name, 
        phone: form.phone
      });
      
      // Dispatch update to Redux (which handles saving it to localStorage)
      dispatch(updateUser({ ...data.data, avatar: avatarUrl }));
      toast.success('Profile updated successfully!');
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
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />
              <div
                onClick={() => previewUrl && setLightboxOpen(true)}
                className={`relative group w-16 h-16 rounded-full overflow-hidden border-2 border-primary-200 dark:border-primary-800 shadow-sm transition-all flex items-center justify-center bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 ${previewUrl ? 'cursor-pointer hover:border-primary-500 hover:shadow-md' : 'cursor-default'}`}
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
                
                {previewUrl && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-white text-[9px] font-bold tracking-wider uppercase">View</span>
                  </div>
                )}
              </div>

              <button
                ref={cameraBtnRef}
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="absolute bottom-0 right-0 w-5 h-5 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors focus:outline-none border border-white dark:border-dark-800"
                title="Change profile picture"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Camera Dropdown Menu */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 z-30 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-dark-700/60 py-1.5 text-dark-800 dark:text-dark-200"
                  >
                    <button
                      type="button"
                      onClick={handleMenuChangePhoto}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors text-xs font-semibold flex items-center gap-2"
                    >
                      <IoCamera className="w-3.5 h-3.5 text-gray-500" />
                      <span>Change Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleMenuUploadPhoto}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors text-xs font-semibold flex items-center gap-2"
                    >
                      <IoImage className="w-3.5 h-3.5 text-gray-500" />
                      <span>Upload New Photo</span>
                    </button>
                    {previewUrl && (
                      <button
                        type="button"
                        onClick={handleMenuDeletePhoto}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 hover:text-red-700 dark:hover:text-red-400 transition-colors text-xs font-semibold flex items-center gap-2 border-t border-gray-100 dark:border-dark-700/60 mt-1 pt-1.5"
                      >
                        <IoTrash className="w-3.5 h-3.5 text-red-500" />
                        <span>Delete Photo</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && previewUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with dark blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors focus:outline-none"
              title="Close Preview"
            >
              <IoClose className="w-6 h-6" />
            </button>
            {/* Image Box */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 max-w-full max-h-[85vh] md:max-h-[90vh] flex items-center justify-center pointer-events-none"
            >
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="max-w-full max-h-[85vh] md:max-h-[90vh] object-contain rounded-xl shadow-2xl pointer-events-auto"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            {/* Dialog Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative z-10 w-full max-w-sm bg-white dark:bg-dark-900 rounded-2xl shadow-2xl p-6 text-center border border-gray-100 dark:border-dark-800"
            >
              <h3 className="font-display font-bold text-xl text-dark-900 dark:text-white mb-2">
                Delete Profile Photo?
              </h3>
              <p className="text-sm text-dark-500 dark:text-dark-400 mb-6">
                Are you sure you want to remove your profile picture?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-dark-700 text-dark-700 dark:text-dark-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors text-sm focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-xl transition-colors text-sm focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

const Profile = () => (
  <ProtectedRoute>
    <ProfileContent />
  </ProtectedRoute>
);

export default Profile;
