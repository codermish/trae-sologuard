import { Request, Response } from 'express'
import prisma from '../lib/prisma.js'

export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { hotelId, flightId } = req.body

    if (!hotelId && !flightId) {
      res.status(400).json({ success: false, error: 'hotelId or flightId is required' })
      return
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        userId,
        hotelId,
        flightId,
      },
    })

    res.status(201).json({
      success: true,
      data: wishlist,
    })
  } catch (error) {
    console.error('Add to wishlist error:', error)
    res.status(500).json({ success: false, error: 'Failed to add to wishlist' })
  }
}

export const getWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        hotel: {
          include: {
            _count: {
              select: { reviews: true },
            },
          },
        },
        flight: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({
      success: true,
      data: wishlist,
    })
  } catch (error) {
    console.error('Get wishlist error:', error)
    res.status(500).json({ success: false, error: 'Failed to get wishlist' })
  }
}

export const removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    await prisma.wishlist.deleteMany({
      where: {
        id,
        userId,
      },
    })

    res.json({
      success: true,
      message: 'Removed from wishlist',
    })
  } catch (error) {
    console.error('Remove from wishlist error:', error)
    res.status(500).json({ success: false, error: 'Failed to remove from wishlist' })
  }
}