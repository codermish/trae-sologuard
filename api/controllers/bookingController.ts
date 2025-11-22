import { Request, Response } from 'express'
import prisma from '../lib/prisma.js'
import { bookingSchema } from '../lib/validation.js'
import { sendBookingConfirmation } from '../lib/email.js'

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = bookingSchema.validate(req.body)
    if (error) {
      res.status(400).json({ success: false, error: error.details[0].message })
      return
    }

    const userId = (req as any).user.id
    const {
      type,
      hotelId,
      roomId,
      flightId,
      carId,
      checkIn,
      checkOut,
      guests,
      rooms,
      specialRequests,
      contactInfo,
    } = req.body

    let totalAmount = 0
    let bookingItems: any[] = []

    // Calculate total amount based on booking type
    if (type === 'hotel' && hotelId && roomId) {
      const room = await prisma.room.findUnique({
        where: { id: roomId },
        include: { hotel: true },
      })

      if (!room) {
        res.status(404).json({ success: false, error: 'Room not found' })
        return
      }

      const nights = Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
      )
      totalAmount = room.price * nights * (rooms || 1)

      bookingItems.push({
        name: `${room.hotel.name} - ${room.name}`,
        price: room.price,
        details: `${nights} nights, ${rooms || 1} room(s)`,
      })
    } else if (type === 'flight' && flightId) {
      const flight = await prisma.flight.findUnique({
        where: { id: flightId },
      })

      if (!flight) {
        res.status(404).json({ success: false, error: 'Flight not found' })
        return
      }

      totalAmount = flight.price * (guests || 1)

      bookingItems.push({
        name: `${flight.airline} ${flight.flightNumber}`,
        price: flight.price,
        details: `${flight.departureAirport} → ${flight.arrivalAirport}`,
      })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        type,
        totalAmount,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        guests: guests || 1,
        rooms: rooms || 1,
        specialRequests,
        contactInfo,
        hotelId,
        roomId,
        flightId,
        carId,
      },
      include: {
        user: true,
        hotel: true,
        room: true,
        flight: true,
        car: true,
      },
    })

    // Send confirmation email
    try {
      await sendBookingConfirmation(contactInfo.email, {
        bookingId: booking.id,
        type: booking.type,
        totalAmount: booking.totalAmount,
        checkIn: booking.checkIn || undefined,
        checkOut: booking.checkOut || undefined,
        items: bookingItems,
      })
    } catch (emailError) {
      console.error('Failed to send booking confirmation:', emailError)
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error('Create booking error:', error)
    res.status(500).json({ success: false, error: 'Booking creation failed' })
  }
}

export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: { userId },
        include: {
          hotel: true,
          room: true,
          flight: true,
          car: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where: { userId } }),
    ])

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Get bookings error:', error)
    res.status(500).json({ success: false, error: 'Failed to get bookings' })
  }
}

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        hotel: true,
        room: true,
        flight: true,
        car: true,
      },
    })

    if (!booking) {
      res.status(404).json({ success: false, error: 'Booking not found' })
      return
    }

    res.json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error('Get booking error:', error)
    res.status(500).json({ success: false, error: 'Failed to get booking' })
  }
}

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    const { reason } = req.body

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId,
        status: 'CONFIRMED',
      },
    })

    if (!booking) {
      res.status(404).json({ success: false, error: 'Booking not found or cannot be cancelled' })
      return
    }

    const cancelledBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    })

    res.json({
      success: true,
      data: cancelledBooking,
    })
  } catch (error) {
    console.error('Cancel booking error:', error)
    res.status(500).json({ success: false, error: 'Failed to cancel booking' })
  }
}