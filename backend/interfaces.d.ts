interface FighterProfile {
  Active: boolean
  FighterId: number
  FirstName: string
  LastName: string
  Moneyline: number
  PreFightDraws: number
  PreFightLosses: number
  PreFightNoContests: number
  PreFightWins: number
  Winner: boolean
}
interface BetUserData {
  _id: string
  name: string
}
export interface FightBetDocument extends Document {
  user: BetUserData
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
  betResultWin?: boolean
  acceptDateTime?: string
  acceptedBy: string | null
}

interface FightStats {
  Advances: number
  DecisionWin: boolean
  FantasyPoints: number
  FantasyPointsDraftKings: number
  FifthRoundWin: boolean
  FighterId: number
  FirstName: string
  FirstRoundWin: boolean
  FourthRoundWin: boolean
  Knockdowns: number
  LastName: string
  Reversals: number
  SecondRoundWin: boolean
  SigStrikesAttempted: number
  SigStrikesLanded: number
  SlamRate: number
  Submissions: number
  TakedownAccuracy: number
  TakedownsAttempted: number
  TakedownsLanded: number
  TakedownsSlams: number
  ThirdRoundWin: boolean
  TimeInControl: number
  TotalStrikesAttempted: number
  TotalStrikesLanded: number
  Winner: boolean
}
interface FinishedFightData extends FightAllData {
  FightStats: FightStats[]
}

export { FighterProfile, FightBetDocument, FinishedFightData }
