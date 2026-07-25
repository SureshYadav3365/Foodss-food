import { useState } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      navigate('/');
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
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Account Type</label>
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
