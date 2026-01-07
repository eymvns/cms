import React from 'react';

const FilterButton = ({ label, icon, count, active, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
        transition-all duration-200 whitespace-nowrap
        ${active 
          ? 'bg-primary text-white shadow-md' 
          : 'bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary'
        }
        ${className}
      `}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className={`
          px-2 py-0.5 rounded-full text-xs font-semibold
          ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}
        `}>
          {count}
        </span>
      )}
    </button>
  );
};

export default FilterButton;

