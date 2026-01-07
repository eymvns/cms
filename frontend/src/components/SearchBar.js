import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ className = '', variant = 'default' }) => {
  const [searchData, setSearchData] = useState({
    departure: '',
    arrival: '',
    date: '',
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchData.departure) params.append('departure', searchData.departure);
    if (searchData.arrival) params.append('arrival', searchData.arrival);
    if (searchData.date) params.append('date', searchData.date);
    navigate(`/search?${params.toString()}`);
  };

  const handleChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className={`bg-white rounded-2xl shadow-card p-1 flex flex-col md:flex-row gap-2 ${className}`}>
        <div className="flex-1 flex flex-col md:flex-row md:divide-x md:divide-gray-200">
          <div className="flex-1 px-4 py-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Départ</label>
            <input
              type="text"
              placeholder="Où partez-vous ?"
              value={searchData.departure}
              onChange={(e) => handleChange('departure', e.target.value)}
              className="w-full text-gray-900 placeholder-gray-400 outline-none text-sm"
            />
          </div>
          <div className="flex-1 px-4 py-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Arrivée</label>
            <input
              type="text"
              placeholder="Où allez-vous ?"
              value={searchData.arrival}
              onChange={(e) => handleChange('arrival', e.target.value)}
              className="w-full text-gray-900 placeholder-gray-400 outline-none text-sm"
            />
          </div>
          <div className="flex-1 px-4 py-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={searchData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full text-gray-900 outline-none text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn-primary rounded-xl px-8 py-3 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Rechercher
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex-1 px-3 border-r border-gray-200">
          <input
            type="text"
            placeholder="Départ"
            value={searchData.departure}
            onChange={(e) => handleChange('departure', e.target.value)}
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="flex-1 px-3 border-r border-gray-200">
          <input
            type="text"
            placeholder="Arrivée"
            value={searchData.arrival}
            onChange={(e) => handleChange('arrival', e.target.value)}
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="px-3">
          <input
            type="date"
            value={searchData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full outline-none text-sm text-gray-700"
          />
        </div>
        <button
          type="submit"
          className="ml-2 bg-primary text-white rounded-full p-2 hover:bg-primary-hover transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

