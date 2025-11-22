import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPin, Search, Filter, Navigation, ZoomIn, ZoomOut, Layers } from 'lucide-react';

// Note: You'll need to add your Mapbox access token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

interface Location {
  id: string;
  name: string;
  type: 'hotel' | 'restaurant' | 'attraction' | 'airport';
  coordinates: [number, number]; // [longitude, latitude]
  description: string;
  rating?: number;
  price?: number;
  image?: string;
}

interface InteractiveMapProps {
  locations: Location[];
  center?: [number, number];
  zoom?: number;
  onLocationSelect: (location: Location) => void;
  className?: string;
}

const locationIcons = {
  hotel: '🏨',
  restaurant: '🍽️',
  attraction: '🏛️',
  airport: '✈️'
};

const locationColors = {
  hotel: '#3B82F6',    // Blue
  restaurant: '#EF4444', // Red
  attraction: '#10B981', // Green
  airport: '#F59E0B'    // Yellow
};

export default function InteractiveMap({ 
  locations, 
  center = [-74.006, 40.7128], // Default to NYC
  zoom = 12, 
  onLocationSelect, 
  className = '' 
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['hotel', 'restaurant', 'attraction', 'airport']);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [currentCenter, setCurrentCenter] = useState(center);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: currentCenter,
          zoom: currentZoom
        });

        map.current.on('load', () => {
          setMapLoaded(true);
          addMarkers();
        });

        map.current.on('move', () => {
          if (map.current) {
            setCurrentZoom(map.current.getZoom());
            setCurrentCenter(map.current.getCenter().toArray() as [number, number]);
          }
        });

      } catch (error) {
        console.error('Error initializing Mapbox:', error);
        // Fallback to a simple map view if Mapbox fails
        setMapLoaded(true);
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapLoaded && map.current) {
      addMarkers();
    }
  }, [locations, selectedTypes, mapLoaded]);

  const addMarkers = () => {
    if (!map.current) return;

    // Remove existing markers
    const markers = document.querySelectorAll('.mapbox-marker');
    markers.forEach(marker => marker.remove());

    // Add new markers
    locations
      .filter(location => selectedTypes.includes(location.type))
      .forEach(location => {
        const el = document.createElement('div');
        el.className = 'mapbox-marker cursor-pointer';
        el.style.backgroundColor = locationColors[location.type];
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.fontSize = '14px';
        el.innerHTML = locationIcons[location.type];

        el.addEventListener('click', () => {
          setSelectedLocation(location);
          onLocationSelect(location);
        });

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.1)';
          el.style.transition = 'transform 0.2s ease';
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });

        new mapboxgl.Marker(el)
          .setLngLat(location.coordinates)
          .addTo(map.current!);
      });
  };

  const handleSearch = () => {
    if (searchQuery.trim() && map.current) {
      // In a real app, you would geocode the search query
      // For now, we'll just center the map on NYC
      map.current.flyTo({
        center: [-74.006, 40.7128],
        zoom: 14,
        duration: 2000
      });
    }
  };

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 14,
              duration: 2000
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const toggleLocationType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filteredLocations = locations.filter(location => 
    selectedTypes.includes(location.type) &&
    (searchQuery === '' || 
     location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     location.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!mapLoaded) {
    return (
      <div className={`relative w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
          <p className="text-sm text-gray-500 mt-2">
            Please add your Mapbox access token to enable full functionality
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-lg p-2 flex items-center space-x-2">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <button
          onClick={handleZoomIn}
          className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={16} className="text-gray-600" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={16} className="text-gray-600" />
        </button>
        <button
          onClick={handleLocateMe}
          className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
          title="Locate Me"
        >
          <Navigation size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Filter Panel */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Filter size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter</span>
          </div>
          <div className="space-y-1">
            {Object.keys(locationIcons).map((type) => (
              <button
                key={type}
                onClick={() => toggleLocationType(type)}
                className={`flex items-center space-x-2 w-full p-1 rounded text-xs transition-colors ${
                  selectedTypes.includes(type)
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span style={{ color: locationColors[type as keyof typeof locationColors] }}>
                  {locationIcons[type as keyof typeof locationIcons]}
                </span>
                <span className="capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Location Info Panel */}
      {selectedLocation && (
        <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">{selectedLocation.name}</h3>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2">{selectedLocation.description}</p>
          {selectedLocation.rating && (
            <div className="flex items-center space-x-1 mb-2">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium">{selectedLocation.rating}</span>
            </div>
          )}
          {selectedLocation.price && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">${selectedLocation.price}</span>
            </div>
          )}
          <button
            onClick={() => onLocationSelect(selectedLocation)}
            className="mt-3 w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        </div>
      )}

      {/* Location List Sidebar */}
      <div className="absolute top-16 right-4 z-10 bg-white rounded-lg shadow-lg p-3 max-w-xs max-h-80 overflow-y-auto">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Nearby Locations ({filteredLocations.length})</h3>
        <div className="space-y-2">
          {filteredLocations.slice(0, 5).map((location) => (
            <div
              key={location.id}
              onClick={() => {
                setSelectedLocation(location);
                if (map.current) {
                  map.current.flyTo({
                    center: location.coordinates,
                    zoom: 15,
                    duration: 1000
                  });
                }
              }}
              className="p-2 rounded cursor-pointer hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <span style={{ color: locationColors[location.type] }}>
                  {locationIcons[location.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{location.name}</p>
                  <p className="text-xs text-gray-500 truncate">{location.description}</p>
                </div>
              </div>
            </div>
          ))}
          {filteredLocations.length > 5 && (
            <p className="text-xs text-gray-500 text-center py-2">
              +{filteredLocations.length - 5} more locations
            </p>
          )}
        </div>
      </div>

      {/* Fallback message if Mapbox token is not set */}
      {mapboxgl.accessToken === 'YOUR_MAPBOX_ACCESS_TOKEN' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded text-xs">
            ⚠️ Please add your Mapbox access token for full map functionality
          </div>
        </div>
      )}
    </div>
  );
}