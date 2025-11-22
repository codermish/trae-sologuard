import Layout from '@/components/Layout'

export default function Home() {
  return (
    <Layout title="Welcome to TravelHub">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4">What is TravelHub?</h3>
          <p className="text-gray-300 mb-6">
            TravelHub is a comprehensive travel booking platform that helps you find the best deals 
            on hotels, flights, and car rentals with advanced search and booking features.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300">Easy-to-use search interface</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">Real-time price comparison</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Secure booking and payment</span>
            </div>
          </div>
          <div className="mt-6">
            <a 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Start Exploring
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4">Features</h3>
          <div className="space-y-6">
            <div className="border-l-4 border-purple-400 pl-4">
              <h4 className="text-lg font-semibold text-white">Hotel Booking</h4>
              <p className="text-gray-300 text-sm">
                Find and book the perfect hotels with advanced filtering, 
                real-time availability, and competitive pricing.
              </p>
            </div>
            <div className="border-l-4 border-blue-400 pl-4">
              <h4 className="text-lg font-semibold text-white">Flight Search</h4>
              <p className="text-gray-300 text-sm">
                Search and compare flights from multiple airlines with 
                flexible dates and fare options.
              </p>
            </div>
            <div className="border-l-4 border-green-400 pl-4">
              <h4 className="text-lg font-semibold text-white">Car Rentals</h4>
              <p className="text-gray-300 text-sm">
                Rent cars worldwide with instant booking confirmation 
                and flexible pickup/drop-off locations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <h3 className="text-2xl font-bold text-white mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">1</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Search Travel</h4>
            <p className="text-gray-300 text-sm">
              Enter your destination, dates, and travel preferences
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">2</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Compare Options</h4>
            <p className="text-gray-300 text-sm">
              Compare prices, ratings, and amenities across providers
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">3</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Book & Enjoy</h4>
            <p className="text-gray-300 text-sm">
              Securely book your travel and enjoy your trip
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}