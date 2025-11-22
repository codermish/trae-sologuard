import { Router } from 'express'
import { searchFlights, getFlightById, getAirports } from '../controllers/flightController.js'

const router = Router()

router.get('/search', searchFlights)
router.get('/airports', getAirports)
router.get('/:id', getFlightById)

export default router