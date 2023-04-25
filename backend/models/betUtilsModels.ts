import { Schema } from 'mongoose'
import { WinMethod, WinnerProjection } from '../consts'
import { FighterProfile } from '../interfaces'

const FighterProfileSchema = new Schema<FighterProfile>({
  Active: {
    type: Boolean,
    required: true
  },
  FighterId: {
    type: Number,
    required: true
  },
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true
  },
  Moneyline: {
    type: Number,
    required: true
  },
  PreFightDraws: {
    type: Number,
    required: true
  },
  PreFightLosses: {
    type: Number,
    required: true
  },
  PreFightNoContests: {
    type: Number,
    required: true
  },
  PreFightWins: {
    type: Number,
    required: true
  },
  Winner: {
    type: Boolean,
    required: true
  }
})

const WinMethodSchema = new Schema({
  type: String,
  enum: [
    WinMethod.KO_TKO,
    WinMethod.SUBMISSION,
    WinMethod.DECISION,
    WinMethod.DRAW,
    WinMethod.DQ,
    WinMethod.TBD
  ]
})

const WinnerProjectionSchema = new Schema({
  type: String,
  enum: [
    WinnerProjection.FIGHTER1,
    WinnerProjection.FIGHTER2,
    WinnerProjection.ANY
  ]
})

export { FighterProfileSchema, WinMethodSchema, WinnerProjectionSchema }
