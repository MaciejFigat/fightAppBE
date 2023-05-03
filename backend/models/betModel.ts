import { model, Schema, Document } from 'mongoose'
import { WinMethod, WinnerProjection } from '../consts'
import { FighterProfile } from '../interfaces'
import { FighterProfileSchema } from './betUtilsModels'

export interface FightBetDocument extends Document {
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
  EventId: number
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
  acceptedBy: string | null

  // acceptedBy?: {
  //   type: Schema.Types.ObjectId
  //   ref: string
  // }
}
const registeredBetSchema = new Schema<FightBetDocument>({
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
    required: true
  },
  activated: {
    type: Boolean,
    default: false
  },
  dateTime: {
    type: String,
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
    type: String,
    required: false
    // ref: 'User'
  }
})

const FightBetModel = model<FightBetDocument>(
  'FightBetModel',
  registeredBetSchema
)

export default FightBetModel
