import { FightBetDocument, FinishedFightData } from '../../interfaces'
import { WinMethod } from '../../consts'
import FightBetModel from '../../models/betModel'
import UserModel from '../../models/userModel'

const getFightData = async (FightId: number): Promise<FinishedFightData> => {
  const response = await fetch(
    `https://api.sportsdata.io/v3/mma/stats/json/Fight/${FightId}?key=${process.env.MMA_API_KEY}`
  )
  const data = await response.json()
  //   console.log(data)
  return data as FinishedFightData
}
const resolveBetsByFightId = async (
  uniqueFightIds: number[],
  readyToResolveBets: FightBetDocument[]
) => {
  const resolvedBets: FightBetDocument[] = []

  for (const fightId of uniqueFightIds) {
    const fightDataById = await getFightData(fightId)

    const betsToResolve = readyToResolveBets.filter(
      bet => bet.FightId === fightId && !bet.isResolved && bet.isAccepted
    )

    for (const bet of betsToResolve) {
      const projectedWinner = fightDataById.FightStats[bet.projectedWinner]
      const winnerIsCorrect = projectedWinner.Winner

      let methodIsCorrect: boolean
      let betResultWin: boolean

      switch (bet.method) {
        case WinMethod.TBD:
          betResultWin = winnerIsCorrect
          break

        case WinMethod.SUBMISSION:
          methodIsCorrect = projectedWinner.Submissions > 0
          betResultWin = winnerIsCorrect && methodIsCorrect
          break

        case WinMethod.KO_TKO:
          methodIsCorrect = projectedWinner.Knockdowns > 0
          betResultWin = winnerIsCorrect && methodIsCorrect
          break

        case WinMethod.DECISION:
          methodIsCorrect = projectedWinner.DecisionWin
          betResultWin = winnerIsCorrect && methodIsCorrect
          break

        case WinMethod.DQ:
          methodIsCorrect =
            !projectedWinner.DecisionWin &&
            projectedWinner.Knockdowns === 0 &&
            projectedWinner.Submissions === 0
          betResultWin = winnerIsCorrect && methodIsCorrect
          break

        case WinMethod.DRAW:
          const fighterOneWin = fightDataById.FightStats[0].Winner
          const fighterTwoWin = fightDataById.FightStats[1].Winner
          methodIsCorrect = !fighterOneWin && !fighterTwoWin
          betResultWin = methodIsCorrect
          break

        default:
          throw new Error(`Invalid bet method: ${bet.method}`)
      }

      const resolvedBet = {
        ...bet,
        isResolved: true,
        betResultWin
      }

      const resolvedBetToSave = await FightBetModel.findOne({
        id: bet.id
      })

      const user = await UserModel.findById(bet.user?._id)
      const userAccepted = await UserModel.findById(bet.acceptedBy)

      if (betResultWin && user) {
        user.coinsAvailable += bet.expectedPayout
        await user.save()
      }
      if (betResultWin === false && userAccepted) {
        userAccepted.coinsAvailable += bet.amountBet
        await userAccepted.save()
      }

      if (resolvedBetToSave) {
        resolvedBetToSave.isResolved = resolvedBet.isResolved
        resolvedBetToSave.betResultWin = resolvedBet.betResultWin
        await resolvedBetToSave.save()
      }

      resolvedBets.push(resolvedBet)
    }
  }

  return resolvedBets
}
const retireBetsByDateDue = async (readyToRetireBets: FightBetDocument[]) => {
  for (const bet of readyToRetireBets) {
    const retiredBetToSave = await FightBetModel.findOne({
      id: bet.id
    })
    const user = await UserModel.findById(bet.user?._id)
    if (!user) {
      throw new Error('User not found')
    }
    user.coinsAvailable += bet.amountBet
    await user.save()
    const retiredBet = {
      ...bet,
      isResolved: true
    }
    if (retiredBetToSave) {
      retiredBetToSave.isResolved = retiredBet.isResolved
      await retiredBetToSave.save()
    }
  }
}

export { getFightData, resolveBetsByFightId, retireBetsByDateDue }
