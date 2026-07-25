import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { IoCall, IoMail, IoLocation } from 'react-icons/io5';
import Layout from '../components/layout/Layout';

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    // Simulate API query call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success('Your message has been sent! We will contact you shortly.');
    reset();
  };

  const contactDetails = [
    { icon: <IoCall className="w-6 h-6" />, label: 'Call Us', value: '+1 (800) 555-FOOD', sub: 'Mon-Sun: 9 AM - 11 PM' },
    { icon: <IoMail className="w-6 h-6" />, label: 'Email Support', value: 'support@foodhub.com', sub: 'Response within 2 hours' },
    { icon: <IoLocation className="w-6 h-6" />, label: 'Corporate Office', value: '100 Food Plaza, Suite 4B', sub: 'Mumbai, MH 400001' },
  ];

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-dark-900 min-h-screen py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold font-display text-dark-900 dark:text-white">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="mt-4 text-dark-600 dark:text-dark-400">
              Have questions about our services, restaurant partnership, or delivery operations? Drop us a line.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Info Cards */}
            <div className="space-y-6 lg:col-span-1">
              {contactDetails.map((detail, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700/60 shadow-sm flex gap-4"
                >
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-500 rounded-xl h-fit">
                    {detail.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-800 dark:text-white font-display mb-1">{detail.label}</h3>
                    <p className="text-sm font-semibold text-primary-600 dark:text-primary-500 mb-1">{detail.value}</p>
                    <p className="text-xs text-dark-500 dark:text-dark-400">{detail.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Form */}
            <div className="bg-white dark:bg-dark-800 p-8 rounded-3xl border border-gray-100 dark:border-dark-700/60 shadow-sm lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">Name</label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className={`mt-1 input-field dark:bg-dark-700 dark:border-dark-600 dark:text-white ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">Email</label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
                      })}
                      className={`mt-1 input-field dark:bg-dark-700 dark:border-dark-600 dark:text-white ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">Subject</label>
                  <input
                    type="text"
                    {...register('subject', { required: 'Subject is required' })}
                    className={`mt-1 input-field dark:bg-dark-700 dark:border-dark-600 dark:text-white ${
                      errors.subject ? 'border-red-500' : ''
                    }`}
                    placeholder="Partnering / Account Inquiry / Order Issues"
                  />
                  {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">Message</label>
                  <textarea
                    rows={4}
                    {...register('message', { required: 'Message body cannot be empty' })}
                    className={`mt-1 input-field dark:bg-dark-700 dark:border-dark-600 dark:text-white resize-none ${
                      errors.message ? 'border-red-500' : ''
                    }`}
                    placeholder="Write your message here..."
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
