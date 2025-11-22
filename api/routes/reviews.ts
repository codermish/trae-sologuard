import { Router } from 'express'
import { createReview, getHotelReviews, getReviewStats } from '../controllers/reviewController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.post('/', authenticateToken, createReview)
router.get('/hotel/:hotelId', getHotelReviews)
router.get('/hotel/:hotelId/stats', getReviewStats)

export default router