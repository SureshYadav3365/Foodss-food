import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { authAPI } from '../../api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authAPI.resetPassword(token, { password: data.password });
      toast.success('Password reset successful! Please log in with your new password.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Token is invalid or has expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 px-4 py-12 sm:px-6 lg:px-8 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-dark-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-dark-700/60 backdrop-blur-sm"
      >
        <div>
          <span className="text-4xl block text-center">🔐</span>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-dark-900 dark:text-white font-display">
            Set New Password
          </h2>
          <p className="mt-2 text-center text-sm text-dark-500 dark:text-dark-400">
            Please enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-700 dark:text-dark-300">
                New Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`mt-1 input-field dark:bg-dark-700 dark:border-dark-600 dark:text-white focus:ring-primary-500/20 focus:border-primary-500 ${
                  errors.password ? 'border-red-500' : ''
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-700 dark:text-dark-300">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === password || 'Passwords do not match',
                })}
                className={`mt-1 input-field dark:bg-dark-700 dark:border-dark-600 dark:text-white focus:ring-primary-500/20 focus:border-primary-500 ${
                  errors.confirmPassword ? 'border-red-500' : ''
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl flex justify-center items-center gap-2 dark:shadow-primary-600/10"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
