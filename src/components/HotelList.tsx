import React, { useState, useMemo } from 'react';
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, Users, Filter, ChevronDown, Heart } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
  description: string;
  coordinates: [number, number];
  reviews: number;
}

interface HotelListProps {
  hotels: Hotel[];
  onHotelSelect: (hotel: Hotel) => void;
  onHotelBook: (hotel: Hotel) => void;
  onAddToWishlist: (hotel: Hotel) => void;
}

export default function HotelList({ hotels, onHotelSelect, onHotelBook, onAddToWishlist }: HotelListProps) {
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterRating, setFilterRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <Wifi size={16} />,
    parking: <Car size={16} />,
    breakfast: <Coffee size={16} />,
    gym: <Dumbbell size={16} />,
  };

  const allAmenities = ['wifi', 'parking', 'breakfast', 'gym'];

  const filteredAndSortedHotels = useMemo(() => {
    let filtered = hotels.filter(hotel => {
      const meetsRating = hotel.rating >= filterRating;
      const meetsPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
      const meetsAmenities = selectedAmenities.length === 0 || 
        selectedAmenities.every(amenity => hotel.amenities.includes(amenity));
      return meetsRating && meetsPrice && meetsAmenities;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [hotels, sortBy, sortOrder, filterRating, priceRange, selectedAmenities]);

  const handleSort = (newSortBy: 'price' | 'rating' | 'name') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with Sort and Filter Controls */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredAndSortedHotels.length} Hotels Found
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter size={16} />
              <span className="text-sm font-medium">Filters</span>
              <ChevronDown 
                size={16} 
                className={`transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <div className="flex space-x-1">
              {(['price', 'rating', 'name'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => handleSort(option)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                    sortBy === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                  {sortBy === option && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <div className="flex items-center space-x-1">
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilterRating(rating)}
                      className={`p-1 rounded transition-colors duration-200 ${
                        filterRating === rating
                          ? 'bg-blue-100 text-blue-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {rating === 0 ? (
                        <span className="text-xs font-medium">Any</span>
                      ) : (
                        <div className="flex">
                          {Array.from({ length: rating }, (_, i) => (
                            <Star key={i} size={16} className="text-yellow-400 fill-current" />
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Amenities Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {allAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center space-x-2 p-2 rounded-md text-sm transition-colors duration-200 ${
                        selectedAmenities.includes(amenity)
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {amenityIcons[amenity]}
                      <span className="capitalize">{amenity}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hotel Cards */}
      <div className="divide-y divide-gray-200">
        {filteredAndSortedHotels.map((hotel) => (
          <div key={hotel.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Hotel Image */}
              <div className="lg:w-1/3">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-48 lg:h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
                  onClick={() => onHotelSelect(hotel)}
                />
              </div>

              {/* Hotel Details */}
              <div className="lg:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 
                        className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                        onClick={() => onHotelSelect(hotel)}
                      >
                        {hotel.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{hotel.location}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onAddToWishlist(hotel)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Heart size={20} className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(hotel.rating)}
                      <span className="text-sm font-medium text-gray-700 ml-1">
                        {hotel.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({hotel.reviews} reviews)
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {hotel.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600"
                      >
                        {amenityIcons[amenity]}
                        <span className="capitalize">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ${hotel.price}
                    </div>
                    <div className="text-sm text-gray-500">per night</div>
                  </div>
                  <button
                    onClick={() => onHotelBook(hotel)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedHotels.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">🏨</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or filters
          </p>
          <button
            onClick={() => {
              setFilterRating(0);
              setPriceRange([0, 1000]);
              setSelectedAmenities([]);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}