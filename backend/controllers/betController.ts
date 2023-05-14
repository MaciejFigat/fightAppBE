import asyncHandler from 'express-async-handler'
import FightBetModel from '../models/betModel'
import { Request, Response, NextFunction } from 'express'
import { UserDocument } from '../models/userModel'
import UserModel from '../models/userModel'
import {
  resolveBetsByFightId,
  retireBetsByDateDue
} from './functions/betHelpers'

export interface RequestWithUser extends Request {
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

  const user = await UserModel.findById(req.user?._id)
  if (user) {
    user.coinsAvailable -= amountBet
    await user.save()
  }
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
        acceptedBy,
        expectedPayout = null
      } = req.body

      const bet = await FightBetModel.findById(req.params.id)

      if (!bet) {
        res.status(404)
        throw new Error('Bet not found')
      }

      if (bet.isAccepted) {
        const error = new Error('Bet already accepted')
        throw error
      }

      bet.isAccepted = isAccepted
      bet.acceptDateTime = acceptDateTime
      bet.expectedPayout = expectedPayout || bet.expectedPayout
      bet.isResolved = isResolved || bet.isResolved
      bet.acceptedBy = acceptedBy || bet.acceptedBy

      const updatedBet = await bet.save()

      if (isAccepted) {
        const user = await UserModel.findById(acceptedBy)
        if (user) {
          user.coinsAvailable -= expectedPayout
          await user.save()
        }
      }

      res.json(updatedBet)
    } catch (err) {
      next(err)
    }
  }
)

// @description delete selected bets
// @route DELETE /api/bets/:id
// @access private

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

      const { _id: userId } = bet.user
      const { amountBet } = bet
      const user = await UserModel.findById(userId)
      if (user) {
        user.coinsAvailable += amountBet
        await user.save()
      }

      res.status(200).json({
        message: 'Bet removed',
        id: bet._id,
        coinsAvailable: user?.coinsAvailable
      })
    } catch (error) {
      next(error)
    }
  }
)

// @description get logged in user bets that he created
// @route GET /api/bets/mybet
// @access private
//? currently not used

const getMyBets = asyncHandler(async (req: RequestWithUser, res: Response) => {
  try {
    const bet = await FightBetModel.find({ user: req.user?._id })
    res.json(bet)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
})
// @description get logged in user bets that he created
// @route GET /api/bets/mybet
// @access private

const getAndResolveMyBets = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Set time to midnight then convert dateTime to ISO string and compare the two dates to check if the dateTime is earlier

      // $lt -  (less than)
      const readyToResolveBets = await FightBetModel.find({
        resolved: false,
        isAccepted: true,
        dateTime: { $lt: today.toISOString() }
      })
      // retire - not accepted with past due date
      const readyToRetireBets = await FightBetModel.find({
        resolved: false,
        isAccepted: false,
        dateTime: { $lt: today.toISOString() }
      })

      const uniqueFightIds = [
        ...new Set(readyToResolveBets.map(bet => bet.FightId))
      ]
      const retiredBets = await retireBetsByDateDue(readyToRetireBets)
      const resolvedBets = await resolveBetsByFightId(
        uniqueFightIds,
        readyToResolveBets
      )
      //* needed later if I want to win or bet retire notifications res.json(resolvedBets)

      const bets = await FightBetModel.find({ user: req.user?._id })
      res.json(bets)
    } catch (error) {
      res.status(500).json({ message: 'Server Error' })
    }
  }
)

// @description get logged in user bets that he accepted
// @route GET /api/bets/myacceptedbet
// @access private

const getMyAcceptedBets = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    try {
      const bet = await FightBetModel.find({ acceptedBy: req.user?._id })
      res.json(bet)
    } catch (error) {
      res.status(500).json({ message: 'Server Error' })
    }
  }
)
// @description get logged in user bets that he accepted
// @route GET /api/bets/myacceptedbet
// @access private

const getAndResolveMyAcceptedBets = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    try {
      const bet = await FightBetModel.find({ acceptedBy: req.user?._id })

      res.json(bet)
    } catch (error) {
      res.status(500).json({ message: 'Server Error' })
    }
  }
)

// @description get all bets
// @route GET /api/bets
// @access private
//? currently not used

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

export {
  addNewBet,
  updateBet,
  deleteBet,
  getMyBets,
  getAndResolveMyBets,
  getAndResolveMyAcceptedBets,
  getMyAcceptedBets,
  getAllBets
}
