import express from 'express'
import { protect } from '../middleware/authMiddleware'
import {
  addNewBet,
  updateBet,
  deleteBet,
  getAllBets,
  getMyAcceptedBets,
  getAndResolveMyBets
} from '../controllers/betController'

const router = express.Router()

router.route('/').post(protect, addNewBet).get(protect, getAllBets)
router.route('/mybets').get(protect, getAndResolveMyBets)
router.route('/myacceptedbet').get(protect, getMyAcceptedBets)
router.route('/:id').delete(protect, deleteBet).put(protect, updateBet)

export default router
