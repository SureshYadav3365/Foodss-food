import { IoStar } from 'react-icons/io5';

const StarRating = ({ rating, size = 'sm', showValue = true }) => {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };

  return (
    <div className="flex items-center gap-1">
      <IoStar className={`${sizes[size]} text-yellow-400`} />
      {showValue && <span className="text-sm font-semibold text-dark-700">{rating?.toFixed(1) || '0.0'}</span>}
    </div>
  );
};

export default StarRating;
