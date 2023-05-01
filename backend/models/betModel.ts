import { model, Schema, Document } from 'mongoose'
import { WinMethod, WinnerProjection } from '../consts'
import { FighterProfile } from '../interfaces'
import { FighterProfileSchema, WinMethodSchema } from './betUtilsModels'
// import User from './userModel'

export interface FightBet extends Document {
  user: {
    type: any
    required: boolean
    ref: string
  }
  id: string
  name: string
  fightName: string
  method: WinMethod
  FightId: number
  activated: boolean
  dateTime: string
  moneyline?: number
  Fighters?: FighterProfile[]
  projectedWinner: WinnerProjection
  amountBet: number
  expectedPayout: number
  isAccepted?: boolean
  isResolved?: boolean
  acceptDateTime?: string
  acceptedBy?: {
    type: any
    ref: string
  }
}
const RegisteredBetSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  fightName: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: [
      WinMethod.KO_TKO,
      WinMethod.SUBMISSION,
      WinMethod.DECISION,
      WinMethod.DRAW,
      WinMethod.DQ,
      WinMethod.TBD
    ],
    required: true
  },
  FightId: {
    type: Number,
    required: true
  },
  EventId: {
    type: Number,
    required: false
  },
  activated: {
    type: Boolean,
    default: false
  },
  dateTime: {
    type: Date,
    required: true
  },
  moneyline: {
    type: Number
  },
  Fighters: {
    type: [FighterProfileSchema],
    required: false
  },
  projectedWinner: {
    type: Schema.Types.Mixed,
    enum: [
      WinnerProjection.FIGHTER1,
      WinnerProjection.FIGHTER2,
      WinnerProjection.ANY
    ],
    required: true
  },
  amountBet: {
    type: Number,
    required: true
  },
  expectedPayout: {
    type: Number,
    required: true
  },
  isAccepted: {
    type: Boolean,
    default: false
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  acceptDateTime: {
    type: Date,
    required: false
  },
  acceptedBy: {
    // type: User,
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'User'
  }
})

const FightBetModel = model<FightBet>('FightBet', RegisteredBetSchema)

export default FightBetModel
