import { Router } from 'express'
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.post('/', authenticateToken, addToWishlist)
router.get('/', authenticateToken, getWishlist)
router.delete('/:id', authenticateToken, removeFromWishlist)

export default router