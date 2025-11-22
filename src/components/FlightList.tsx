import React, { useState } from 'react';
import { Plane, Clock, Calendar, Filter, Heart } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: {
    code: string;
    name: string;
    city: string;
  };
  destination: {
    code: string;
    name: string;
    city: string;
  };
  departure: {
    time: string;
    date: string;
    timezone: string;
  };
  arrival: {
    time: string;
    date: string;
    timezone: string;
  };
  duration: string;
  aircraft: string;
  price: {
    amount: number;
    currency: string;
  };
  class: string;
  stops: number;
  availableSeats: number;
}

interface FlightListProps {
  flights: Flight[];
  onFlightSelect: (flight: Flight) => void;
  onToggleWishlist: (flightId: string) => void;
  wishlist: string[];
}

export default function FlightList({ flights, onFlightSelect, onToggleWishlist, wishlist }: FlightListProps) {
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [filterStops, setFilterStops] = useState<number | null>(null);
  const [filterAirlines, setFilterAirlines] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuthStore();

  const allAirlines = Array.from(new Set(flights.map(flight => flight.airline)));

  const filteredAndSortedFlights = flights
    .filter(flight => {
      const meetsStops = filterStops === null || flight.stops === filterStops;
      const meetsAirlines = filterAirlines.length === 0 || filterAirlines.includes(flight.airline);
      const meetsPrice = flight.price.amount >= priceRange[0] && flight.price.amount <= priceRange[1];
      return meetsStops && meetsAirlines && meetsPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price.amount - b.price.amount;
        case 'duration':
          const durationA = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1]?.split('m')[0] || '0');
          const durationB = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1]?.split('m')[0] || '0');
          return durationA - durationB;
        case 'departure':
          return new Date(a.departure.date + ' ' + a.departure.time).getTime() - 
                 new Date(b.departure.date + ' ' + b.departure.time).getTime();
        default:
          return 0;
      }
    });

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDuration = (duration: string) => {
    return duration.replace('h', 'h ').replace('m', 'm');
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'duration' | 'departure')}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="price">Price</option>
              <option value="duration">Duration</option>
              <option value="departure">Departure Time</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredAndSortedFlights.length} flights found
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stops Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stops</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stops"
                    value=""
                    checked={filterStops === null}
                    onChange={() => setFilterStops(null)}
                    className="mr-2"
                  />
                  Any
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stops"
                    value="0"
                    checked={filterStops === 0}
                    onChange={() => setFilterStops(0)}
                    className="mr-2"
                  />
                  Non-stop
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stops"
                    value="1"
                    checked={filterStops === 1}
                    onChange={() => setFilterStops(1)}
                    className="mr-2"
                  />
                  1 Stop
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stops"
                    value="2"
                    checked={filterStops === 2}
                    onChange={() => setFilterStops(2)}
                    className="mr-2"
                  />
                  2+ Stops
                </label>
              </div>
            </div>

            {/* Airlines Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Airlines</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {allAirlines.map(airline => (
                  <label key={airline} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filterAirlines.includes(airline)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilterAirlines([...filterAirlines, airline]);
                        } else {
                          setFilterAirlines(filterAirlines.filter(a => a !== airline));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{airline}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {filteredAndSortedFlights.map(flight => (
          <div
            key={flight.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onFlightSelect(flight)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plane className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{flight.airline}</h3>
                  <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                  <p className="text-xs text-gray-500">{flight.aircraft}</p>
                </div>
              </div>
              {user && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(flight.id);
                  }}
                  className={`p-2 rounded-full ${
                    wishlist.includes(flight.id)
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-400 hover:text-red-500'
                  } transition-colors`}
                >
                  <Heart className={`w-5 h-5 ${wishlist.includes(flight.id) ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>

            {/* Flight Route */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{flight.origin.code}</div>
                <div className="text-sm text-gray-600">{flight.origin.city}</div>
                <div className="text-sm font-medium">{formatTime(flight.departure.time)}</div>
                <div className="text-xs text-gray-500">{flight.departure.date}</div>
              </div>

              <div className="flex-1 px-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <div className="bg-white px-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(flight.duration)}</span>
                      </div>
                      {flight.stops > 0 && (
                        <div className="text-xs text-center text-gray-500 mt-1">
                          {flight.stops} {flight.stops === 1 ? 'stop' : 'stops'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{flight.destination.code}</div>
                <div className="text-sm text-gray-600">{flight.destination.city}</div>
                <div className="text-sm font-medium">{formatTime(flight.arrival.time)}</div>
                <div className="text-xs text-gray-500">{flight.arrival.date}</div>
              </div>
            </div>

            {/* Flight Details */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{flight.class}</span>
                <span>•</span>
                <span>{flight.availableSeats} seats available</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {flight.price.currency}{flight.price.amount}
                </div>
                <div className="text-sm text-gray-600">per person</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedFlights.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No flights found matching your criteria.</p>
          <button
            onClick={() => {
              setSortBy('price');
              setFilterStops(null);
              setFilterAirlines([]);
              setPriceRange([0, 2000]);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}