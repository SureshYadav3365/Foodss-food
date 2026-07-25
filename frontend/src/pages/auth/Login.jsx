import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { IoMail, IoLockClosed, IoEye, IoEyeOff } from 'react-icons/io5';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { loginUser, clearError } from '../../store/slices/authSlice';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!');
      const role = result.payload.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'restaurant') navigate('/restaurant/dashboard');
      else navigate('/');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 to-orange-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="card p-8">
            <div className="text-center mb-8">
              <span className="text-4xl">🍔</span>
              <h1 className="font-display text-2xl font-bold text-dark-900 mt-3">Welcome Back</h1>
              <p className="text-dark-500 mt-1">Sign in to continue ordering</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<IoMail />}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <div>
                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  icon={<IoLockClosed />}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  error={error}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-[38px] text-gray-400">
                  {showPass ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
              <Button type="submit" loading={loading} className="w-full">Sign In</Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-dark-500">
              <p className="font-medium text-dark-700 mb-2">Demo Accounts:</p>
              <p>User: user@fooddelivery.com / user123</p>
              <p>Admin: admin@fooddelivery.com / admin123</p>
              <p>Restaurant: restaurant@fooddelivery.com / restaurant123</p>
            </div>

            <p className="text-center mt-6 text-sm text-dark-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 font-semibold hover:underline">Sign Up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
