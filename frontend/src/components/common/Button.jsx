const Button = ({ children, variant = 'primary', size = 'md', loading, disabled, className = '', ...props }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200',
    ghost: 'text-dark-600 hover:bg-gray-100 font-medium py-2 px-4 rounded-xl transition-all duration-200',
  };

  const sizes = {
    sm: 'py-1.5 px-4 text-sm',
    md: '',
    lg: 'py-3 px-8 text-lg',
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className} ${(loading || disabled) ? 'opacity-60 cursor-not-allowed' : ''}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </span>
      ) : children}
    </button>
  );
};

export default Button;
