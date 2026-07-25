const VegBadge = ({ isVeg }) => (
  <span className={`inline-flex items-center justify-center w-4 h-4 border-2 ${isVeg ? 'border-green-600' : 'border-red-600'} rounded-sm`}>
    <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
  </span>
);

export default VegBadge;
