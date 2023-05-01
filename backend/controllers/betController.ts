import asyncHandler from 'express-async-handler'
import FightBetModel from '../models/betModel'
import { Request, Response, NextFunction } from 'express'
import { UserDocument } from '../models/userModel'

interface RequestWithUser extends Request {
  user?: UserDocument
}
// @desc Fetch all bets
// @route POST /api/bets
// @access public

const addNewBet = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const {
    id,
    name,
    fightName,
    method,
    FightId,
    EventId,
    activated,
    dateTime,
    moneyline,
    Fighters,
    projectedWinner,
    expectedPayout,
    amountBet
  } = req.body

  const bet = new FightBetModel({
    user: req.user?._id,
    id,
    name,
    fightName,
    method,
    FightId,
    EventId,
    activated,
    dateTime,
    moneyline,
    Fighters,
    projectedWinner,
    amountBet,
    expectedPayout
  })

  const createdBet = await bet.save()

  res.status(201).json(createdBet)
})

// @description update Bet
// @route PUT /api/bets/:id
// @access private

const updateBet = asyncHandler(
  async (req, res: Response, next: NextFunction) => {
    try {
      const {
        isAccepted = false,
        acceptDateTime = null,
        isResolved = false,
        userID = null,
        expectedPayout = null
      } = req.body
      const bet = await FightBetModel.findById(req.params.id)

      if (!bet) {
        res.status(404)
        throw new Error('Bet not found')
      }

      bet.isAccepted = isAccepted
      bet.acceptDateTime = acceptDateTime
      bet.isResolved = isResolved
      bet.acceptedBy = userID
      bet.expectedPayout = expectedPayout

      const updatedBet = await bet.save()
      res.json(updatedBet)
    } catch (err) {
      next(err)
    }
  }
)

// @description delete selected bets
// @route DELETE /api/bets/:id
// @access private/admin

const deleteBet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
      const bet = await FightBetModel.findById(id)

      if (!bet) {
        res.status(404)
        throw new Error('Bet not found')
      }

      await bet.remove()

      res.status(200).json({ message: 'Bet removed' })
    } catch (error) {
      next(error)
    }
  }
)

// @description get logged in user bet
// @route GET /api/bet/mybet
// @access private

const getMyBets = asyncHandler(async (req: RequestWithUser, res: Response) => {
  try {
    const bet = await FightBetModel.find({ user: req.user?._id })
    res.json(bet)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// @description get all bets
// @route GET /api/bets
// @access private

const getAllBets = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bets = await FightBetModel.find({}).populate('user', 'id name')
      res.json(bets)
    } catch (error) {
      next(error)
    }
  }
)

export { addNewBet, updateBet, deleteBet, getMyBets, getAllBets }
