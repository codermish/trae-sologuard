import { Router } from 'express'
import { searchHotels, getHotelById, getHotelRooms, getPopularDestinations } from '../controllers/hotelController.js'

const router = Router()

router.get('/search', searchHotels)
router.get('/destinations', getPopularDestinations)
router.get('/:id', getHotelById)
router.get('/:id/rooms', getHotelRooms)

export default router