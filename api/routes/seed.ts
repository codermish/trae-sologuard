import { Router } from 'express'
import { seedDatabase, clearDatabase } from '../controllers/seedController.js'

const router = Router()

router.post('/seed', seedDatabase)
router.delete('/clear', clearDatabase)

export default router