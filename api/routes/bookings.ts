import { Router } from 'express'
import { createBooking, getBookings, getBookingById, cancelBooking } from '../controllers/bookingController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.post('/', authenticateToken, createBooking)
router.get('/', authenticateToken, getBookings)
router.get('/:id', authenticateToken, getBookingById)
router.put('/:id/cancel', authenticateToken, cancelBooking)

export default router