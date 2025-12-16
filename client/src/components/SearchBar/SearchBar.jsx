import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiMapPin, FiChevronDown } from 'react-icons/fi';
import { getServices, getCategories } from '../../utils/mockData';

// Static location data for Lebanon - Baalbek-Hermel region
const LOCATIONS = [
  { id: 1, name_en: 'Baalbek', name_ar: 'بعلبك' },
  { id: 2, name_en: 'Hermel', name_ar: 'الهرمل' },
  { id: 3, name_en: 'Arsal', name_ar: 'عرسال' },
  { id: 4, name_en: 'Ras Baalbek', name_ar: 'رأس بعلبك' },
  { id: 5, name_en: 'Brital', name_ar: 'بريتال' },
  { id: 6, name_en: 'Deir El Ahmar', name_ar: 'دير الأحمر' },
  { id: 7, name_en: 'Labweh', name_ar: 'اللبوة' },
  { id: 8, name_en: 'Nabi Sheet', name_ar: 'النبي شيت' }
];

const SearchBar = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS);
  const [filteredServices, setFilteredServices] = useState([]);

  const locationRef = useRef(null);
  const serviceRef = useRef(null);
  const navigate = useNavigate();

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const categories = getCategories();
    setFilteredServices(categories);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(event.target)) {
        setShowServiceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    setShowLocationDropdown(true);

    // Filter locations based on input
    const filtered = LOCATIONS.filter(loc =>
      (isRTL ? loc.name_ar : loc.name_en).toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowServiceDropdown(true);

    // Filter services based on input
    const categories = getCategories();
    const filtered = categories.filter(cat =>
      cat.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  const selectLocation = (loc) => {
    setLocation(isRTL ? loc.name_ar : loc.name_en);
    setShowLocationDropdown(false);
  };

  const selectService = (service) => {
    setSearchQuery(service.name);
    setShowServiceDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <form onSubmit={handleSearch} className="mx-auto flex max-w-3xl flex-col gap-3 md:flex-row">
      {/* Service Search Input */}
      <div className="relative flex-1" ref={serviceRef}>
        <FiSearch className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500 ${isRTL ? 'right-3' : 'left-3'}`} />
        <input
          type="text"
          placeholder="Search Service"
          value={searchQuery}
          onChange={handleServiceChange}
          onFocus={() => setShowServiceDropdown(true)}
          className={`h-12 w-full rounded-lg bg-white dark:bg-gray-800 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0BA5EC]`}
        />
        <FiChevronDown className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`} />

        {/* Service Dropdown */}
        {showServiceDropdown && filteredServices.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredServices.map((service) => (
              <button
                key={service.category_id}
                type="button"
                onClick={() => selectService(service)}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-b dark:border-gray-700 last:border-b-0 transition-colors"
              >
                {service.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Location Input */}
      <div className="relative flex-1" ref={locationRef}>
        <FiMapPin className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500 ${isRTL ? 'right-3' : 'left-3'}`} />
        <input
          type="text"
          placeholder="Search Location"
          value={location}
          onChange={handleLocationChange}
          onFocus={() => setShowLocationDropdown(true)}
          className={`h-12 w-full rounded-lg bg-white dark:bg-gray-800 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0BA5EC]`}
        />
        <FiChevronDown className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`} />

        {/* Location Dropdown */}
        {showLocationDropdown && filteredLocations.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredLocations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => selectLocation(loc)}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-b dark:border-gray-700 last:border-b-0 transition-colors"
              >
                {isRTL ? loc.name_ar : loc.name_en}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="h-12 bg-[#0BA5EC] px-8 rounded-lg text-white font-medium hover:bg-[#0BA5EC]/90 transition-colors"
      >
        {t('common.search')}
      </button>
    </form>
  );
};

export default SearchBar;
