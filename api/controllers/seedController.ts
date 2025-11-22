import { Request, Response } from 'express'
import prisma from '../lib/prisma.js'

export const seedDatabase = async (req: Request, res: Response): Promise<void> => {
  try {
    // Create sample destinations
    const destinations = await prisma.destination.createMany({
      data: [
        {
          name: 'New York',
          country: 'USA',
          description: 'The city that never sleeps, home to iconic landmarks like Times Square, Central Park, and the Statue of Liberty.',
          images: [
            'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
            'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800',
          ],
          popular: true,
          latitude: 40.7128,
          longitude: -74.0060,
        },
        {
          name: 'Paris',
          country: 'France',
          description: 'The City of Light, famous for the Eiffel Tower, Louvre Museum, and romantic atmosphere.',
          images: [
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
            'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800',
          ],
          popular: true,
          latitude: 48.8566,
          longitude: 2.3522,
        },
        {
          name: 'Tokyo',
          country: 'Japan',
          description: 'A vibrant metropolis blending traditional culture with cutting-edge technology.',
          images: [
            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
            'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800',
          ],
          popular: true,
          latitude: 35.6762,
          longitude: 139.6503,
        },
        {
          name: 'London',
          country: 'UK',
          description: 'Historic capital with royal palaces, world-class museums, and iconic landmarks.',
          images: [
            'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
            'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800',
          ],
          popular: true,
          latitude: 51.5074,
          longitude: -0.1278,
        },
        {
          name: 'Dubai',
          country: 'UAE',
          description: 'Modern oasis with luxury shopping, ultramodern architecture, and desert adventures.',
          images: [
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880e?w=800',
            'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800',
          ],
          popular: true,
          latitude: 25.2048,
          longitude: 55.2708,
        },
      ],
    })

    // Create sample hotels
    const hotels = await prisma.hotel.createMany({
      data: [
        {
          name: 'The Plaza Hotel',
          description: 'Luxury hotel overlooking Central Park with world-class amenities and service.',
          address: 'Fifth Avenue at Central Park South',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postalCode: '10019',
          latitude: 40.7648,
          longitude: -73.9754,
          rating: 4.8,
          priceRange: { min: 450, max: 1200 },
          amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge', 'Parking'],
          images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
          ],
          phone: '+1-212-759-3000',
          email: 'info@theplaza.com',
          website: 'https://www.theplaza.com',
          checkIn: '15:00',
          checkOut: '11:00',
          policies: {
            cancellation: 'Free cancellation up to 24 hours before check-in',
            pets: 'Pets allowed with additional fee',
            smoking: 'Non-smoking property',
          },
        },
        {
          name: 'Hotel Ritz Paris',
          description: 'Historic luxury hotel in the heart of Paris with elegant rooms and Michelin-starred dining.',
          address: '15 Place Vendôme',
          city: 'Paris',
          state: 'Île-de-France',
          country: 'France',
          postalCode: '75001',
          latitude: 48.8683,
          longitude: 2.3279,
          rating: 4.9,
          priceRange: { min: 800, max: 2500 },
          amenities: ['WiFi', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge', 'Parking', 'Business Center'],
          images: [
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
          ],
          phone: '+33-1-43-16-30-30',
          email: 'reservation@ritzparis.com',
          website: 'https://www.ritzparis.com',
          checkIn: '15:00',
          checkOut: '12:00',
          policies: {
            cancellation: 'Free cancellation up to 48 hours before check-in',
            pets: 'Pets allowed',
            smoking: 'Non-smoking property',
          },
        },
        {
          name: 'Park Hyatt Tokyo',
          description: 'Contemporary luxury hotel with stunning city views and exceptional service.',
          address: '3-7-1-2 Nishi Shinjuku',
          city: 'Tokyo',
          state: 'Tokyo',
          country: 'Japan',
          postalCode: '163-1055',
          latitude: 35.6896,
          longitude: 139.6917,
          rating: 4.7,
          priceRange: { min: 350, max: 900 },
          amenities: ['WiFi', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge', 'Parking', 'Pool'],
          images: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbb5ed?w=800',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          ],
          phone: '+81-3-5322-1234',
          email: 'tokyo.park@hyatt.com',
          website: 'https://www.hyatt.com',
          checkIn: '15:00',
          checkOut: '11:00',
          policies: {
            cancellation: 'Free cancellation up to 24 hours before check-in',
            pets: 'No pets allowed',
            smoking: 'Non-smoking property',
          },
        },
      ],
    })

    // Create sample rooms
    const rooms = await prisma.room.createMany({
      data: [
        // Plaza Hotel rooms
        {
          hotelId: (await prisma.hotel.findFirst({ where: { name: 'The Plaza Hotel' } }))?.id || '',
          name: 'Deluxe Room',
          description: 'Spacious room with park view and luxury amenities',
          type: 'deluxe',
          capacity: 2,
          price: 650,
          size: 450,
          amenities: ['King Bed', 'Park View', 'Marble Bathroom', 'Mini Bar', 'Safe'],
          images: ['https://images.unsplash.com/photo-1582719478250-c89ecf4ef4bb?w=800'],
          quantity: 10,
        },
        {
          hotelId: (await prisma.hotel.findFirst({ where: { name: 'The Plaza Hotel' } }))?.id || '',
          name: 'Suite',
          description: 'Luxurious suite with separate living area and premium amenities',
          type: 'suite',
          capacity: 4,
          price: 1200,
          size: 800,
          amenities: ['King Bed', 'Living Room', 'Dining Area', 'Kitchenette', 'Park View'],
          images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800'],
          quantity: 5,
        },
        // Ritz Paris rooms
        {
          hotelId: (await prisma.hotel.findFirst({ where: { name: 'Hotel Ritz Paris' } }))?.id || '',
          name: 'Superior Room',
          description: 'Elegant room with classic Parisian style and modern amenities',
          type: 'standard',
          capacity: 2,
          price: 850,
          size: 350,
          amenities: ['Queen Bed', 'City View', 'Luxury Bathroom', 'Mini Bar'],
          images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
          quantity: 15,
        },
        // Park Hyatt Tokyo rooms
        {
          hotelId: (await prisma.hotel.findFirst({ where: { name: 'Park Hyatt Tokyo' } }))?.id || '',
          name: 'Standard Room',
          description: 'Modern room with city view and Japanese design elements',
          type: 'standard',
          capacity: 2,
          price: 450,
          size: 400,
          amenities: ['King Bed', 'City View', 'Japanese Bath', 'Work Desk', 'WiFi'],
          images: ['https://images.unsplash.com/photo-1542314831-068cd1dbb5ed?w=800'],
          quantity: 20,
        },
      ],
    })

    // Create sample flights
    const flights = await prisma.flight.createMany({
      data: [
        {
          airline: 'American Airlines',
          flightNumber: 'AA101',
          aircraft: 'Boeing 777-300ER',
          departureAirport: 'JFK',
          arrivalAirport: 'LHR',
          departureTime: new Date('2024-12-15T10:30:00Z'),
          arrivalTime: new Date('2024-12-15T22:15:00Z'),
          duration: 465, // minutes
          stops: 0,
          stopovers: [],
          price: 850,
          priceClass: 'economy',
          availableSeats: 150,
          totalSeats: 200,
        },
        {
          airline: 'Delta Air Lines',
          flightNumber: 'DL202',
          aircraft: 'Airbus A330-300',
          departureAirport: 'LAX',
          arrivalAirport: 'CDG',
          departureTime: new Date('2024-12-16T14:20:00Z'),
          arrivalTime: new Date('2024-12-17T08:45:00Z'),
          duration: 625, // minutes
          stops: 1,
          stopovers: ['JFK'],
          price: 950,
          priceClass: 'business',
          availableSeats: 80,
          totalSeats: 100,
        },
        {
          airline: 'United Airlines',
          flightNumber: 'UA303',
          aircraft: 'Boeing 787-9',
          departureAirport: 'SFO',
          arrivalAirport: 'NRT',
          departureTime: new Date('2024-12-17T11:45:00Z'),
          arrivalTime: new Date('2024-12-18T15:30:00Z'),
          duration: 705, // minutes
          stops: 0,
          stopovers: [],
          price: 1200,
          priceClass: 'economy',
          availableSeats: 120,
          totalSeats: 180,
        },
      ],
    })

    // Create sample cars
    const cars = await prisma.car.createMany({
      data: [
        {
          company: 'Hertz',
          model: 'Toyota Camry',
          category: 'standard',
          year: 2024,
          seats: 5,
          doors: 4,
          transmission: 'automatic',
          fuelType: 'gasoline',
          pricePerDay: 65,
          location: 'JFK Airport',
          latitude: 40.6413,
          longitude: -73.7781,
          images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800'],
          features: ['GPS', 'Bluetooth', 'Backup Camera', 'Cruise Control'],
          quantity: 5,
        },
        {
          company: 'Enterprise',
          model: 'Honda CR-V',
          category: 'suv',
          year: 2024,
          seats: 7,
          doors: 5,
          transmission: 'automatic',
          fuelType: 'gasoline',
          pricePerDay: 85,
          location: 'LAX Airport',
          latitude: 33.9425,
          longitude: -118.4081,
          images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'],
          features: ['GPS', 'Bluetooth', 'Backup Camera', 'All-Wheel Drive'],
          quantity: 3,
        },
      ],
    })

    res.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        destinations: 5,
        hotels: 3,
        rooms: 4,
        flights: 3,
        cars: 2,
      },
    })
  } catch (error) {
    console.error('Database seeding error:', error)
    res.status(500).json({ success: false, error: 'Failed to seed database' })
  }
}

export const clearDatabase = async (req: Request, res: Response): Promise<void> => {
  try {
    // Delete in reverse order to respect foreign key constraints
    await prisma.review.deleteMany()
    await prisma.wishlist.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.room.deleteMany()
    await prisma.flight.deleteMany()
    await prisma.car.deleteMany()
    await prisma.hotel.deleteMany()
    await prisma.destination.deleteMany()

    res.json({
      success: true,
      message: 'Database cleared successfully',
    })
  } catch (error) {
    console.error('Database clearing error:', error)
    res.status(500).json({ success: false, error: 'Failed to clear database' })
  }
}