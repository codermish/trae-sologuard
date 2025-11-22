import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin, Plane, Hotel, Car } from 'lucide-react';
import { useSearchStore } from '../stores/searchStore';

interface SearchBarProps {
  onSearch: (type: 'hotels' | 'flights' | 'cars' | 'packages') => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [activeTab, setActiveTab] = useState<'hotels' | 'flights' | 'cars' | 'packages'>('hotels');
  const { hotelFilters, flightFilters, setHotelFilters, setFlightFilters } = useSearchStore();

  const handleHotelSearch = () => {
    if (!hotelFilters.destination || !hotelFilters.checkIn || !hotelFilters.checkOut) {
      alert('Please fill in all required fields');
      return;
    }
    onSearch('hotels');
  };

  const handleFlightSearch = () => {
    if (!flightFilters.origin || !flightFilters.destination || !flightFilters.departureDate) {
      alert('Please fill in all required fields');
      return;
    }
    onSearch('flights');
  };

  const tabs = [
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'cars', label: 'Cars', icon: Car },
    { id: 'packages', label: 'Packages', icon: MapPin },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Hotel Search Form */}
      {activeTab === 'hotels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={hotelFilters.destination}
                onChange={(e) => setHotelFilters({ destination: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={hotelFilters.checkIn}
                onChange={(e) => setHotelFilters({ checkIn: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={hotelFilters.checkOut}
                onChange={(e) => setHotelFilters({ checkOut: e.target.value })}
                min={hotelFilters.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={hotelFilters.guests}
                onChange={(e) => setHotelFilters({ guests: parseInt(e.target.value) })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleHotelSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 h-10 mt-6"
          >
            <Search size={18} />
            <span>Search Hotels</span>
          </button>
        </div>
      )}

      {/* Flight Search Form */}
      {activeTab === 'flights' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <div className="relative">
                <Plane className="absolute left-3 top-3 h-4 w-4 text-gray-400 transform -rotate-45" />
                <input
                  type="text"
                  placeholder="Departure city"
                  value={flightFilters.origin}
                  onChange={(e) => setFlightFilters({ origin: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Arrival city"
                  value={flightFilters.destination}
                  onChange={(e) => setFlightFilters({ destination: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={flightFilters.departureDate}
                  onChange={(e) => setFlightFilters({ departureDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={flightFilters.returnDate || ''}
                  onChange={(e) => setFlightFilters({ returnDate: e.target.value })}
                  min={flightFilters.departureDate || new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={flightFilters.passengers}
                  onChange={(e) => setFlightFilters({ passengers: parseInt(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Cabin Class:</span>
              <div className="flex space-x-2">
                {['economy', 'business', 'first'].map((classType) => (
                  <button
                    key={classType}
                    onClick={() => setFlightFilters({ cabinClass: classType as any })}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                      flightFilters.cabinClass === classType
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {classType.charAt(0).toUpperCase() + classType.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleFlightSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Search size={18} />
            <span>Search Flights</span>
          </button>
        </div>
      )}

      {/* Cars and Packages tabs - simplified for now */}
      {(activeTab === 'cars' || activeTab === 'packages') && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-4">
            {activeTab === 'cars' ? '🚗' : '📦'}
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {activeTab === 'cars' ? 'Car Rentals' : 'Travel Packages'}
          </h3>
          <p className="text-gray-500">
            {activeTab === 'cars' 
              ? 'Find the perfect car for your trip'
              : 'Bundle and save with our travel packages'
            }
          </p>
          <button
            onClick={() => onSearch(activeTab)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
          >
            Coming Soon
          </button>
        </div>
      )}
    </div>
  );
}