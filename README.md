# TravelHub - Complete Travel Booking Platform

A comprehensive travel booking platform similar to Expedia, built with React, TypeScript, Node.js, and modern web technologies.

## Features

### Core Functionality
- 🔍 **Flight Search**: Search flights with filters (price, duration, stops, airlines)
- 🏨 **Hotel Search**: Find hotels with filters (price, rating, amenities, location)
- 🚗 **Car Rentals**: Search and book rental cars
- 📦 **Vacation Packages**: Bundle deals for flights + hotels
- 🗺️ **Interactive Maps**: View hotel locations and nearby attractions
- ⭐ **Reviews & Ratings**: User reviews and ratings system
- ❤️ **Wishlist**: Save favorite hotels and flights

### User Experience
- 📱 **Responsive Design**: Works perfectly on mobile and desktop
- ⚡ **Fast Performance**: Optimized for speed and user experience
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- 🔐 **Secure**: Industry-standard security practices
- 🌙 **Dark Mode**: Toggle between light and dark themes

### Booking & Payments
- 💳 **Secure Payments**: Multiple payment methods via Stripe
- 📧 **Email Notifications**: Booking confirmations and updates
- 🔄 **Easy Management**: Modify or cancel bookings
- 🎫 **Digital Tickets**: Mobile-friendly booking confirmations

### Admin Features
- 📊 **Dashboard**: Comprehensive analytics and reporting
- 🏨 **Content Management**: Manage hotels, flights, and destinations
- 👥 **User Management**: Customer support and user administration
- 💰 **Revenue Tracking**: Financial reporting and insights

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for forms
- **React Query** for data fetching
- **Mapbox GL JS** for interactive maps
- **Zustand** for state management

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **Prisma** ORM
- **Redis** for caching
- **JWT** authentication
- **Stripe** payment processing
- **SendGrid** email service

### External APIs
- Flight data (mock implementation)
- Hotel data (mock implementation)
- Weather data integration
- Maps and geocoding

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travelhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/travelhub"

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
SENDGRID_API_KEY="SG..."
FROM_EMAIL="noreply@travelhub.com"

# Maps
MAPBOX_ACCESS_TOKEN="pk.eyJ1..."

# External APIs
FLIGHT_API_KEY="..."
HOTEL_API_KEY="..."
```

## Project Structure

```
travelhub/
├── src/                    # Frontend React app
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand stores
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript types
├── api/                    # Backend API
│   ├── routes/             # API routes
│   ├── controllers/        # Route handlers
│   ├── models/             # Database models
│   ├── middleware/         # Express middleware
│   ├── services/           # Business logic
│   └── utils/              # Backend utilities
├── prisma/                 # Database schema
├── public/                 # Static assets
└── tests/                  # Test files
```

## Development

### Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run client:dev` - Frontend only
- `npm run server:dev` - Backend only
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run check` - TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data

### Testing

- `npm run test` - Run all tests
- `npm run test:unit` - Unit tests only
- `npm run test:integration` - Integration tests
- `npm run test:e2e` - End-to-end tests

## Deployment

### Docker

```bash
# Build and run with Docker
docker-compose up --build
```

### Manual Deployment

1. Build the application
   ```bash
   npm run build
   ```

2. Set up production database
   ```bash
   npm run db:migrate:prod
   ```

3. Start production server
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@travelhub.com or join our Slack channel.
