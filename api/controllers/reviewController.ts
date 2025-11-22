import { Request, Response } from 'express'
import prisma from '../lib/prisma.js'
import { reviewSchema } from '../lib/validation.js'

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
      res.status(400).json({ success: false, error: error.details[0].message })
      return
    }

    const userId = (req as any).user.id
    const { hotelId, rating, title, comment, images } = req.body

    // Check if user has booked this hotel
    const hasBooking = await prisma.booking.findFirst({
      where: {
        userId,
        hotelId,
        status: 'COMPLETED',
      },
    })

    if (!hasBooking) {
      res.status(403).json({ success: false, error: 'You must have completed a booking to review this hotel' })
      return
    }

    // Check if user has already reviewed this hotel
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_hotelId: {
          userId,
          hotelId,
        },
      },
    })

    if (existingReview) {
      res.status(409).json({ success: false, error: 'You have already reviewed this hotel' })
      return
    }

    const review = await prisma.review.create({
      data: {
        userId,
        hotelId,
        rating,
        title,
        comment,
        images: images || [],
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    // Update hotel rating
    const hotelReviews = await prisma.review.findMany({
      where: { hotelId },
      select: { rating: true },
    })

    const averageRating = hotelReviews.reduce((sum, review) => sum + review.rating, 0) / hotelReviews.length

    await prisma.hotel.update({
      where: { id: hotelId },
      data: { rating: Math.round(averageRating * 10) / 10 }, // Round to 1 decimal
    })

    res.status(201).json({
      success: true,
      data: review,
    })
  } catch (error) {
    console.error('Create review error:', error)
    res.status(500).json({ success: false, error: 'Failed to create review' })
  }
}

export const getHotelReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hotelId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { hotelId },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { hotelId } }),
    ])

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Get hotel reviews error:', error)
    res.status(500).json({ success: false, error: 'Failed to get reviews' })
  }
}

export const getReviewStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hotelId } = req.params

    const stats = await prisma.review.groupBy({
      by: ['rating'],
      where: { hotelId },
      _count: {
        rating: true,
      },
    })

    const totalReviews = await prisma.review.count({
      where: { hotelId },
    })

    const averageRating = await prisma.review.aggregate({
      where: { hotelId },
      _avg: {
        rating: true,
      },
    })

    res.json({
      success: true,
      data: {
        totalReviews,
        averageRating: averageRating._avg.rating,
        ratingDistribution: stats.map(stat => ({
          rating: stat.rating,
          count: stat._count.rating,
          percentage: Math.round((stat._count.rating / totalReviews) * 100),
        })),
      },
    })
  } catch (error) {
    console.error('Get review stats error:', error)
    res.status(500).json({ success: false, error: 'Failed to get review stats' })
  }
}