// src/pages/dashboard/components/StatsCard.jsx
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatsCard = ({ title, value, icon, color, trend, trendValue }) => {
  const colors = {
    blue: 'bg-blue-50 border-blue-200',
    red: 'bg-red-50 border-red-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  const iconColors = {
    blue: 'text-blue-600',
    red: 'text-red-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
  };

  return (
    <div className={`${colors[color]} border rounded-icsi-lg p-6 hover:shadow-icsi transition-all`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-icsi-text mb-1">{title}</p>
          <p className="text-2xl font-bold text-icsi-titleform">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <FaArrowUp size={12} className="text-green-600" />
              ) : (
                <FaArrowDown size={12} className="text-red-600" />
              )}
              <span className={`text-xs ml-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        
        <div className={`text-4xl ${iconColors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;