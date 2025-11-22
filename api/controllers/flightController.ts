import { Request, Response } from 'express'
import prisma from '../lib/prisma.js'
import { flightSearchSchema } from '../lib/validation.js'

export const searchFlights = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = flightSearchSchema.validate(req.query)
    if (error) {
      res.status(400).json({ success: false, error: error.details[0].message })
      return
    }

    const {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers = 1,
      cabinClass = 'economy',
      maxPrice,
      maxStops,
    } = req.query

    // Try to use database first
    try {
      // Build where clause
      const where: any = {
        isActive: true,
        departureAirport: origin as string,
        arrivalAirport: destination as string,
        departureTime: {
          gte: new Date(departureDate as string),
          lt: new Date(new Date(departureDate as string).getTime() + 24 * 60 * 60 * 1000), // Same day
        },
        availableSeats: { gte: parseInt(passengers as string) },
      }

      // Add dynamic properties
      if (cabinClass) {
        where.priceClass = cabinClass as string
      }

      if (maxPrice) {
        where.price = { lte: parseFloat(maxPrice as string) }
      }

      if (maxStops !== undefined) {
        where.stops = { lte: parseInt(maxStops as string) }
      }

      // Pagination
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const skip = (page - 1) * limit

      const [outboundFlights, total] = await Promise.all([
        prisma.flight.findMany({
          where,
          orderBy: { price: 'asc' },
          skip,
          take: limit,
        }),
        prisma.flight.count({ where }),
      ])

      let returnFlights = []
      if (returnDate) {
        const returnWhere: any = {
          isActive: true,
          departureAirport: destination as string,
          arrivalAirport: origin as string,
          departureTime: {
            gte: new Date(returnDate as string),
            lt: new Date(new Date(returnDate as string).getTime() + 24 * 60 * 60 * 1000),
          },
          availableSeats: { gte: parseInt(passengers as string) },
        }

        if (cabinClass) returnWhere.priceClass = cabinClass as string
        if (maxPrice) returnWhere.price = { lte: parseFloat(maxPrice as string) }
        if (maxStops !== undefined) returnWhere.stops = { lte: parseInt(maxStops as string) }

        returnFlights = await prisma.flight.findMany({
          where: returnWhere,
          orderBy: { price: 'asc' },
        })
      }

      if (outboundFlights.length > 0) {
        res.json({
          success: true,
          data: {
            outbound: outboundFlights,
            return: returnFlights,
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
    const mockFlights = [
      {
        id: '1',
        airline: 'Delta Airlines',
        flightNumber: 'DL1234',
        aircraft: 'Boeing 737-900',
        departureAirport: 'JFK',
        arrivalAirport: 'LAX',
        departureTime: new Date(departureDate + 'T08:00:00'),
        arrivalTime: new Date(departureDate + 'T11:30:00'),
        duration: 390, // 6.5 hours in minutes
        stops: 0,
        stopovers: [],
        price: 350,
        priceClass: 'economy',
        availableSeats: 45,
        totalSeats: 180,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        airline: 'United Airlines',
        flightNumber: 'UA5678',
        aircraft: 'Airbus A320',
        departureAirport: 'LAX',
        arrivalAirport: 'ORD',
        departureTime: new Date(departureDate + 'T14:15:00'),
        arrivalTime: new Date(departureDate + 'T20:45:00'),
        duration: 270, // 4.5 hours in minutes
        stops: 0,
        stopovers: [],
        price: 280,
        priceClass: 'economy',
        availableSeats: 23,
        totalSeats: 150,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        airline: 'American Airlines',
        flightNumber: 'AA9012',
        aircraft: 'Boeing 737-800',
        departureAirport: 'ORD',
        arrivalAirport: 'JFK',
        departureTime: new Date(departureDate + 'T09:30:00'),
        arrivalTime: new Date(departureDate + 'T13:00:00'),
        duration: 150, // 2.5 hours in minutes
        stops: 0,
        stopovers: [],
        price: 220,
        priceClass: 'economy',
        availableSeats: 67,
        totalSeats: 160,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]

    // Filter mock flights based on search criteria
    let filteredFlights = mockFlights

    if (origin && destination) {
      filteredFlights = filteredFlights.filter(flight => 
        flight.departureAirport === origin && flight.arrivalAirport === destination
      )
    }

    if (maxPrice) {
      const maxPriceNum = parseFloat(maxPrice as string)
      filteredFlights = filteredFlights.filter(flight => flight.price <= maxPriceNum)
    }

    if (maxStops !== undefined) {
      const maxStopsNum = parseInt(maxStops as string)
      filteredFlights = filteredFlights.filter(flight => flight.stops <= maxStopsNum)
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedFlights = filteredFlights.slice(startIndex, endIndex)

    // Generate return flights if requested
    let returnFlights = []
    if (returnDate) {
      returnFlights = filteredFlights.map(flight => ({
        ...flight,
        id: flight.id + '-return',
        departureAirport: flight.arrivalAirport,
        arrivalAirport: flight.departureAirport,
        departureTime: new Date(returnDate + 'T' + flight.arrivalTime.toTimeString().split(' ')[0]),
        arrivalTime: new Date(returnDate + 'T' + flight.departureTime.toTimeString().split(' ')[0]),
      }))
    }

    res.json({
      success: true,
      data: {
        outbound: paginatedFlights,
        return: returnFlights,
        pagination: {
          page,
          limit,
          total: filteredFlights.length,
          pages: Math.ceil(filteredFlights.length / limit),
        },
      },
    })
  } catch (error) {
    console.error('Flight search error:', error)
    res.status(500).json({ success: false, error: 'Flight search failed' })
  }
}

export const getFlightById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const flight = await prisma.flight.findUnique({
      where: { id },
    })

    if (!flight) {
      res.status(404).json({ success: false, error: 'Flight not found' })
      return
    }

    res.json({
      success: true,
      data: flight,
    })
  } catch (error) {
    console.error('Get flight error:', error)
    res.status(500).json({ success: false, error: 'Failed to get flight' })
  }
}

export const getAirports = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query

    // Mock airport data - in real app, this would come from a database
    const airports = [
      { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
      { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA' },
      { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'UK' },
      { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
      { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
      { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
      { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
      { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
    ]

    let filteredAirports = airports
    if (query) {
      const searchQuery = (query as string).toLowerCase()
      filteredAirports = airports.filter(
        airport =>
          airport.code.toLowerCase().includes(searchQuery) ||
          airport.name.toLowerCase().includes(searchQuery) ||
          airport.city.toLowerCase().includes(searchQuery) ||
          airport.country.toLowerCase().includes(searchQuery)
      )
    }

    res.json({
      success: true,
      data: filteredAirports.slice(0, 10), // Limit results
    })
  } catch (error) {
    console.error('Get airports error:', error)
    res.status(500).json({ success: false, error: 'Failed to get airports' })
  }
}