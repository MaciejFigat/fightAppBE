import { model, Schema, Document } from 'mongoose'
import { WinMethod, WinnerProjection } from '../consts'
import { FighterProfile } from '../interfaces'
import {
  FighterProfileSchema,
  WinMethodSchema,
  WinnerProjectionSchema
} from './betUtilsModels'

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
  //  TODO - add the rest of the fields pertaining to the accepted condition etc.
  isAccepted?: boolean
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
    type: WinMethodSchema,
    required: true
  },
  FightId: {
    type: Number,
    required: true
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
    type: [FighterProfileSchema]
  },
  projectedWinner: {
    type: WinnerProjectionSchema,
    required: true
  },
  amountBet: {
    type: Number,
    required: true
  },
  isAccepted: {
    type: Boolean,
    default: false
  },
  acceptDateTime: {
    type: Date
  },
  acceptedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

const FightBetModel = model<FightBet>('FightBet', RegisteredBetSchema)

export default FightBetModel
