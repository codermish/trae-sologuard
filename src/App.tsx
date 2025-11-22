import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SearchBar, HotelList, FlightList, BookingForm, InteractiveMap, UserDashboard } from './components';
import { useAuthStore } from './stores/authStore';
import { useSearchStore } from './stores/searchStore';
import GrafanaPage from './pages/GrafanaPage';
import SoloGuardDashboard from './components/SoloGuardDashboard';
import axios from 'axios';

interface Booking {
  id: string;
  type: 'hotel' | 'flight';
  name: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: number;
  details: any;
}

// Mock data
const mockHotels = [
  {
    id: '1',
    name: 'The Plaza Hotel',
    location: 'Fifth Avenue, New York',
    rating: 4.8,
    price: 450,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
    amenities: ['wifi', 'parking', 'breakfast', 'gym'],
    description: 'Luxury hotel located on Fifth Avenue with stunning views of Central Park.',
    coordinates: [-73.974, 40.7614] as [number, number],
    reviews: 2847
  },
  {
    id: '2',
    name: 'The Beverly Hills Hotel',
    location: 'Sunset Boulevard, Los Angeles',
    rating: 4.7,
    price: 520,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop',
    amenities: ['wifi', 'breakfast', 'gym'],
    description: 'Iconic luxury hotel in the heart of Beverly Hills with world-class amenities.',
    coordinates: [-118.399, 34.0837] as [number, number],
    reviews: 1923
  },
  {
    id: '3',
    name: 'The Ritz-Carlton Chicago',
    location: 'Magnificent Mile, Chicago',
    rating: 4.6,
    price: 380,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d7?w=400&h=250&fit=crop',
    amenities: ['wifi', 'parking', 'gym'],
    description: 'Sophisticated hotel with panoramic city views and exceptional service.',
    coordinates: [-87.6244, 41.8843] as [number, number],
    reviews: 1567
  }
];

const mockFlights = [
  {
    id: '1',
    airline: 'Delta Airlines',
    flightNumber: 'DL1234',
    origin: { code: 'JFK', name: 'John F. Kennedy', city: 'New York' },
    destination: { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles' },
    departure: { time: '08:00', date: '2024-12-15', timezone: 'EST' },
    arrival: { time: '11:30', date: '2024-12-15', timezone: 'PST' },
    duration: '6h 30m',
    aircraft: 'Boeing 737-900',
    price: { amount: 350, currency: '$' },
    class: 'Economy',
    stops: 0,
    availableSeats: 45
  },
  {
    id: '2',
    airline: 'United Airlines',
    flightNumber: 'UA5678',
    origin: { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles' },
    destination: { code: 'ORD', name: "O'Hare International", city: 'Chicago' },
    departure: { time: '14:15', date: '2024-12-16', timezone: 'PST' },
    arrival: { time: '20:45', date: '2024-12-16', timezone: 'CST' },
    duration: '4h 30m',
    aircraft: 'Airbus A320',
    price: { amount: 280, currency: '$' },
    class: 'Economy',
    stops: 0,
    availableSeats: 23
  },
  {
    id: '3',
    airline: 'American Airlines',
    flightNumber: 'AA9012',
    origin: { code: 'ORD', name: "O'Hare International", city: 'Chicago' },
    destination: { code: 'JFK', name: 'John F. Kennedy', city: 'New York' },
    departure: { time: '09:30', date: '2024-12-17', timezone: 'CST' },
    arrival: { time: '13:00', date: '2024-12-17', timezone: 'EST' },
    duration: '2h 30m',
    aircraft: 'Boeing 737-800',
    price: { amount: 220, currency: '$' },
    class: 'Economy',
    stops: 0,
    availableSeats: 67
  }
];

const mockLocations = [
  {
    id: '1',
    name: 'Central Park',
    type: 'attraction' as const,
    coordinates: [-73.9654, 40.7829] as [number, number],
    description: 'Iconic urban park in the heart of Manhattan',
    rating: 4.8
  },
  {
    id: '2',
    name: 'The Plaza Food Hall',
    type: 'restaurant' as const,
    coordinates: [-73.9742, 40.7614] as [number, number],
    description: 'Gourmet food hall with diverse culinary options',
    rating: 4.5,
    price: 45
  },
  {
    id: '3',
    name: 'John F. Kennedy Airport',
    type: 'airport' as const,
    coordinates: [-73.7781, 40.6413] as [number, number],
    description: 'Major international airport serving New York City'
  }
];

const mockBookings = [
  {
    id: '1',
    type: 'hotel' as const,
    name: 'The Plaza Hotel',
    date: '2024-12-20',
    status: 'confirmed' as const,
    price: 450,
    details: {}
  },
  {
    id: '2',
    type: 'flight' as const,
    name: 'Delta Airlines DL1234',
    date: '2024-12-15',
    status: 'pending' as const,
    price: 350,
    details: {}
  }
];

const mockWishlist = [
  {
    id: '1',
    type: 'hotel' as const,
    name: 'The Beverly Hills Hotel',
    price: 520,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop',
    rating: 4.7,
    location: 'Sunset Boulevard, Los Angeles'
  }
];

function Navigation() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-2xl font-bold text-blue-600">TravelHub</a>
            <div className="hidden md:flex space-x-6">
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="/hotels" className="text-gray-700 hover:text-blue-600 transition-colors">Hotels</a>
              <a href="/flights" className="text-gray-700 hover:text-blue-600 transition-colors">Flights</a>
              <a href="/cars" className="text-gray-700 hover:text-blue-600 transition-colors">Car Rentals</a>
              <a href="/grafana" className="text-gray-700 hover:text-blue-600 transition-colors">Analytics</a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <a href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Dashboard
                </a>
                <button
                  onClick={logout}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">Login</a>
                <a href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function HomePage() {
  const [searchType, setSearchType] = useState<'hotels' | 'flights' | 'cars' | 'packages' | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [bookingItem, setBookingItem] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { hotelFilters, flightFilters } = useSearchStore();

  const handleSearch = async (type: 'hotels' | 'flights' | 'cars' | 'packages') => {
    setSearchType(type);
    setLoading(true);
    setError(null);

    try {
      if (type === 'hotels') {
        const response = await axios.get('http://localhost:3001/api/hotels/search', {
          params: {
            destination: hotelFilters.destination,
            checkIn: hotelFilters.checkIn,
            checkOut: hotelFilters.checkOut,
            guests: hotelFilters.guests,
            rooms: hotelFilters.rooms,
          }
        });
        setHotels(response.data.data.hotels);
      } else if (type === 'flights') {
        const response = await axios.get('http://localhost:3001/api/flights/search', {
          params: {
            origin: flightFilters.origin,
            destination: flightFilters.destination,
            departureDate: flightFilters.departureDate,
            returnDate: flightFilters.returnDate,
            passengers: flightFilters.passengers,
            cabinClass: flightFilters.cabinClass,
          }
        });
        setFlights(response.data.data.outbound);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSelect = (hotel: any) => {
    setSelectedHotel(hotel);
  };

  const handleFlightSelect = (flight: any) => {
    setSelectedFlight(flight);
  };

  const handleHotelBook = (hotel: any) => {
    setBookingItem({
      id: hotel.id,
      type: 'hotel',
      name: hotel.name,
      price: hotel.price,
      details: hotel
    });
    setShowBookingForm(true);
  };

  const handleFlightBook = (flight: any) => {
    setBookingItem({
      id: flight.id,
      type: 'flight',
      name: `${flight.airline} ${flight.flightNumber}`,
      price: flight.price.amount,
      details: flight
    });
    setShowBookingForm(true);
  };

  const handleBookingComplete = (bookingData: any) => {
    const newBooking = {
      id: Date.now().toString(),
      type: bookingData.item.type,
      name: bookingData.item.name,
      date: new Date().toISOString().split('T')[0],
      status: 'confirmed' as const,
      price: bookingData.item.price,
      details: bookingData
    };
    setBookings([...bookings, newBooking]);
    setShowBookingForm(false);
    setBookingItem(null);
    alert(`Booking confirmed! Reference: ${bookingData.bookingReference}`);
  };

  const handleAddToWishlist = (item: any) => {
    const newItem = {
      id: Date.now().toString(),
      type: item.type || 'hotel',
      name: item.name,
      price: item.price || item.price?.amount || 0,
      image: item.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
      rating: item.rating || 4.5,
      location: item.location || 'Unknown Location'
    };
    setWishlist([...wishlist, newItem]);
  };

  const handleBookingCancel = (bookingId: string) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'cancelled' }
        : booking
    ));
  };

  const handleWishlistRemove = (itemId: string) => {
    setWishlist(wishlist.filter(item => item.id !== itemId));
  };

  const handleLocationSelect = (location: any) => {
    console.log('Location selected:', location);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Your Next Adventure</h1>
          <p className="text-xl mb-8">Find the best deals on hotels, flights, and car rentals</p>
          
          <div className="max-w-6xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchType && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Results */}
            <div className="lg:col-span-2">
              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Searching...</p>
                </div>
              )}
              
              {error && (
                <div className="text-center py-12">
                  <div className="text-red-600 text-lg mb-2">Error</div>
                  <p className="text-gray-600">{error}</p>
                </div>
              )}
              
              {!loading && !error && searchType === 'hotels' && hotels.length > 0 && (
                <HotelList
                  hotels={hotels}
                  onHotelSelect={handleHotelSelect}
                  onHotelBook={handleHotelBook}
                  onAddToWishlist={handleAddToWishlist}
                />
              )}
              
              {!loading && !error && searchType === 'flights' && flights.length > 0 && (
                <FlightList
                  flights={flights}
                  onFlightSelect={handleFlightSelect}
                  onToggleWishlist={handleAddToWishlist}
                  wishlist={wishlist.map(item => item.id)}
                />
              )}
              
              {!loading && !error && searchType === 'hotels' && hotels.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🏨</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Hotels Found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
              
              {!loading && !error && searchType === 'flights' && flights.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">✈️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Flights Found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
              
              {(searchType === 'cars' || searchType === 'packages') && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">
                    {searchType === 'cars' ? '🚗' : '📦'}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchType === 'cars' ? 'Car Rentals' : 'Travel Packages'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchType === 'cars' 
                      ? 'Find the perfect car for your trip'
                      : 'Bundle and save with our travel packages'
                    }
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
                    Coming Soon
                  </button>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore Locations</h3>
                <InteractiveMap
                  locations={mockLocations}
                  center={[-74.006, 40.7128]}
                  zoom={12}
                  onLocationSelect={handleLocationSelect}
                  className="h-96 rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && bookingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <BookingForm
              item={bookingItem}
              onComplete={handleBookingComplete}
              onCancel={() => {
                setShowBookingForm(false);
                setBookingItem(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Dashboard Link */}
      <div className="fixed bottom-6 right-6">
        <a
          href="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [wishlist, setWishlist] = useState(mockWishlist);

  const handleBookingCancel = (bookingId: string) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'cancelled' }
        : booking
    ));
  };

  const handleWishlistRemove = (itemId: string) => {
    setWishlist(wishlist.filter(item => item.id !== itemId));
  };

  const handleProfileUpdate = (profile: any) => {
    console.log('Profile updated:', profile);
  };

  return (
    <UserDashboard
      bookings={bookings}
      wishlist={wishlist}
      onBookingCancel={handleBookingCancel}
      onWishlistRemove={handleWishlistRemove}
      onProfileUpdate={handleProfileUpdate}
    />
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/grafana" element={<GrafanaPage />} />
          <Route path="/sologuard" element={<SoloGuardDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;