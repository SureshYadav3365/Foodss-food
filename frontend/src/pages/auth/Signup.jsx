import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { IoMail, IoLockClosed, IoPerson } from 'react-icons/io5';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { registerUser, clearError } from '../../store/slices/authSlice';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', phone: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    // Form validations
    if (form.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters long.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      toast.error('Phone number must be a valid 10-digit number.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      const role = result.payload.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'restaurant') navigate('/restaurant/dashboard');
      else navigate('/');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 to-orange-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="card p-8">
            <div className="text-center mb-8">
              <span className="text-4xl">🍔</span>
              <h1 className="font-display text-2xl font-bold text-dark-900 mt-3">Create Account</h1>
              <p className="text-dark-500 mt-1">Join FoodHub and start ordering</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" icon={<IoPerson />} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Email" type="email" icon={<IoMail />} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label="Password" type="password" icon={<IoLockClosed />} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={error} required />
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Account Type</label>
                <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="user">Customer</option>
                  <option value="restaurant">Restaurant Owner</option>
                </select>
              </div>
              <Button type="submit" loading={loading} className="w-full">Create Account</Button>
            </form>

            <p className="text-center mt-6 text-sm text-dark-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Signup;
