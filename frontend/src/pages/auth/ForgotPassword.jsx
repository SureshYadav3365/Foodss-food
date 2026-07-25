import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { authAPI } from '../../api';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authAPI.forgotPassword(data);
      setSuccess(true);
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
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
          <span className="text-4xl block text-center">🔑</span>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-dark-900 dark:text-white font-display">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-dark-500 dark:text-dark-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {!success ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-700 dark:text-dark-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`mt-1 input-field dark:bg-dark-700 dark:border-dark-600 dark:text-white focus:ring-primary-500/20 focus:border-primary-500 ${
                  errors.email ? 'border-red-500' : ''
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
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
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="inline-flex p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              ✓
            </div>
            <p className="text-sm text-dark-600 dark:text-dark-300">
              If an account exists for that email, we have sent instructions to reset your password. Please check your inbox.
            </p>
          </div>
        )}

        <div className="text-center">
          <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
