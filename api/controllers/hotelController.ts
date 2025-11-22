import { Request, Response } from 'express'
import prisma from '../lib/prisma.js'
import { hotelSearchSchema } from '../lib/validation.js'

export const searchHotels = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = hotelSearchSchema.validate(req.query)
    if (error) {
      res.status(400).json({ success: false, error: error.details[0].message })
      return
    }

    const {
      destination,
      checkIn,
      checkOut,
      guests = 1,
      rooms = 1,
      minPrice,
      maxPrice,
      rating,
      amenities,
    } = req.query

    // Try to use database first
    try {
      // Build where clause
      const where: any = {
        isActive: true,
      }

      // Destination filter (search in city, country, or name)
      if (destination) {
        where.OR = [
          { city: { contains: destination as string, mode: 'insensitive' } },
          { country: { contains: destination as string, mode: 'insensitive' } },
          { name: { contains: destination as string, mode: 'insensitive' } },
        ]
      }

      // Price range filter
      if (minPrice || maxPrice) {
        where.priceRange = {}
        if (minPrice) where.priceRange.gte = parseFloat(minPrice as string)
        if (maxPrice) where.priceRange.lte = parseFloat(maxPrice as string)
      }

      // Rating filter
      if (rating) {
        where.rating = { gte: parseFloat(rating as string) }
      }

      // Amenities filter
      if (amenities) {
        const amenityList = Array.isArray(amenities) ? amenities : [amenities]
        where.amenities = { hasSome: amenityList }
      }

      // Pagination
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const skip = (page - 1) * limit

      const [hotels, total] = await Promise.all([
        prisma.hotel.findMany({
          where,
          include: {
            rooms: {
              where: {
                capacity: { gte: parseInt(guests as string) },
                isAvailable: true,
              },
              take: 3, // Limit rooms shown
            },
            _count: {
              select: { reviews: true },
            },
          },
          orderBy: { rating: 'desc' },
          skip,
          take: limit,
        }),
        prisma.hotel.count({ where }),
      ])

      if (hotels.length > 0) {
        res.json({
          success: true,
          data: {
            hotels,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit),
            },
          },
        })
        return
      }
    } catch (dbError) {
      console.log('Database not available, using mock data')
    }

    // Fallback to mock data if database is not available or returns no results
    const mockHotels = [
      {
        id: '1',
        name: 'The Plaza Hotel',
        description: 'Luxury hotel located on Fifth Avenue with stunning views of Central Park.',
        address: 'Fifth Avenue, New York',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        latitude: 40.7614,
        longitude: -73.974,
        rating: 4.8,
        priceRange: { min: 400, max: 800 },
        amenities: ['wifi', 'parking', 'breakfast', 'gym', 'spa'],
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop'],
        phone: '+1-212-759-3000',
        email: 'info@theplaza.com',
        website: 'https://theplazany.com',
        checkIn: '15:00',
        checkOut: '11:00',
        policies: { cancellation: 'Free until 24 hours before check-in' },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        rooms: [
          {
            id: 'r1',
            hotelId: '1',
            name: 'Deluxe Room',
            description: 'Spacious room with city view',
            type: 'deluxe',
            capacity: 2,
            price: 450,
            size: 400,
            amenities: ['wifi', 'tv', 'minibar'],
            images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'],
            isAvailable: true,
            quantity: 5
          }
        ],
        _count: { reviews: 2847 }
      },
      {
        id: '2',
        name: 'The Beverly Hills Hotel',
        description: 'Iconic luxury hotel in the heart of Beverly Hills with world-class amenities.',
        address: 'Sunset Boulevard, Los Angeles',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        latitude: 34.0837,
        longitude: -118.399,
        rating: 4.7,
        priceRange: { min: 500, max: 1200 },
        amenities: ['wifi', 'breakfast', 'gym', 'pool', 'spa'],
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop'],
        phone: '+1-310-276-2251',
        email: 'info@beverlyhillshotel.com',
        website: 'https://beverlyhillshotel.com',
        checkIn: '15:00',
        checkOut: '11:00',
        policies: { cancellation: 'Free until 48 hours before check-in' },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        rooms: [
          {
            id: 'r2',
            hotelId: '2',
            name: 'Premium Suite',
            description: 'Luxurious suite with pool view',
            type: 'suite',
            capacity: 4,
            price: 820,
            size: 800,
            amenities: ['wifi', 'tv', 'minibar', 'balcony'],
            images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'],
            isAvailable: true,
            quantity: 3
          }
        ],
        _count: { reviews: 1923 }
      },
      {
        id: '3',
        name: 'The Ritz-Carlton Chicago',
        description: 'Sophisticated hotel with panoramic city views and exceptional service.',
        address: 'Magnificent Mile, Chicago',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        latitude: 41.8843,
        longitude: -87.6244,
        rating: 4.6,
        priceRange: { min: 350, max: 700 },
        amenities: ['wifi', 'parking', 'gym', 'restaurant'],
        images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d7?w=400&h=250&fit=crop'],
        phone: '+1-312-266-1000',
        email: 'info@ritzcarlton.com',
        website: 'https://ritzcarlton.com/chicago',
        checkIn: '15:00',
        checkOut: '11:00',
        policies: { cancellation: 'Free until 24 hours before check-in' },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        rooms: [
          {
            id: 'r3',
            hotelId: '3',
            name: 'Executive Room',
            description: 'Modern room with workspace',
            type: 'executive',
            capacity: 2,
            price: 380,
            size: 350,
            amenities: ['wifi', 'tv', 'desk', 'coffee maker'],
            images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400'],
            isAvailable: true,
            quantity: 8
          }
        ],
        _count: { reviews: 1567 }
      }
    ]

    // Filter mock data based on search criteria
    let filteredHotels = mockHotels

    if (destination) {
      const dest = (destination as string).toLowerCase()
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.city.toLowerCase().includes(dest) ||
        hotel.name.toLowerCase().includes(dest) ||
        hotel.address.toLowerCase().includes(dest)
      )
    }

    if (rating) {
      const minRating = parseFloat(rating as string)
      filteredHotels = filteredHotels.filter(hotel => hotel.rating >= minRating)
    }

    if (minPrice || maxPrice) {
      filteredHotels = filteredHotels.filter(hotel => {
        const hotelMin = hotel.priceRange.min
        const hotelMax = hotel.priceRange.max
        const searchMin = minPrice ? parseFloat(minPrice as string) : 0
        const searchMax = maxPrice ? parseFloat(maxPrice as string) : Infinity
        
        return (hotelMin <= searchMax && hotelMax >= searchMin)
      })
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedHotels = filteredHotels.slice(startIndex, endIndex)

    res.json({
      success: true,
      data: {
        hotels: paginatedHotels,
        pagination: {
          page,
          limit,
          total: filteredHotels.length,
          pages: Math.ceil(filteredHotels.length / limit),
        },
      },
    })
  } catch (error) {
    console.error('Hotel search error:', error)
    res.status(500).json({ success: false, error: 'Hotel search failed' })
  }
}

export const getHotelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        rooms: {
          where: { isAvailable: true },
          orderBy: { price: 'asc' },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: { reviews: true, bookings: true },
        },
      },
    })

    if (!hotel) {
      res.status(404).json({ success: false, error: 'Hotel not found' })
      return
    }

    res.json({
      success: true,
      data: hotel,
    })
  } catch (error) {
    console.error('Get hotel error:', error)
    res.status(500).json({ success: false, error: 'Failed to get hotel' })
  }
}

export const getHotelRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { checkIn, checkOut, guests } = req.query

    const rooms = await prisma.room.findMany({
      where: {
        hotelId: id,
        isAvailable: true,
        capacity: { gte: parseInt(guests as string) || 1 },
      },
      orderBy: { price: 'asc' },
    })

    res.json({
      success: true,
      data: rooms,
    })
  } catch (error) {
    console.error('Get hotel rooms error:', error)
    res.status(500).json({ success: false, error: 'Failed to get hotel rooms' })
  }
}

export const getPopularDestinations = async (req: Request, res: Response): Promise<void> => {
  try {
    const destinations = await prisma.destination.findMany({
      where: { popular: true },
      orderBy: { name: 'asc' },
    })

    res.json({
      success: true,
      data: destinations,
    })
  } catch (error) {
    console.error('Get destinations error:', error)
    res.status(500).json({ success: false, error: 'Failed to get destinations' })
  }
}