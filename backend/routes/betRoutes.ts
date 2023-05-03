import express from 'express'
import { protect } from '../middleware/authMiddleware'
import {
  addNewBet,
  updateBet,
  deleteBet,
  getMyBets,
  getAllBets
} from '../controllers/betController'

const router = express.Router()

router.route('/').post(protect, addNewBet).get(protect, getAllBets)
router.route('/mybets').get(protect, getMyBets)
router.route('/:id').delete(protect, deleteBet).put(protect, updateBet)

export default router
