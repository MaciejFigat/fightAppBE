// import fetch from 'node-fetch'
import { FightBetDocument, FinishedFightData } from '../../interfaces'
import { WinMethod } from '../../consts'
import FightBetModel from '../../models/betModel'
// const MMA_API_KEY = process.env.MMA_API_KEY

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

      const resolvedBetToSave = await FightBetModel.findById(resolvedBet.id)

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

// const resolveBetsByFightId = async (
//   uniqueFightIds: number[],
//   readyToResolveBets: FightBetDocument[]
// ) => {
//   const resolvedBets: FightBetDocument[] = []

//   for (const FightId of uniqueFightIds) {
//     const fightDataById = await getFightData(FightId)

//     const betsToResolve = readyToResolveBets.filter(
//       bet =>
//         bet.FightId === FightId &&
//         bet.isResolved === false &&
//         bet.isAccepted === true
//     )

//     betsToResolve.forEach(async bet => {
//       const projectedWinnerIndex = bet.projectedWinner
//       // FightStats {}
//       const projectedWinner = fightDataById.FightStats[projectedWinnerIndex]

//       const winnerIsCorrect = projectedWinner.Winner === true

//       if (bet.method === WinMethod.TBD) {
//         const resolvedBet: FightBetDocument = {
//           ...bet,
//           isResolved: true,
//           betResultWin: winnerIsCorrect
//         }

//         const resolvedBetToSave = await FightBetModel.findById(resolvedBet.id)

//         if (resolvedBetToSave) {
//           resolvedBetToSave.isResolved = resolvedBet.isResolved
//           resolvedBetToSave.betResultWin = resolvedBet.betResultWin
//         }

//         const updatedBet = await resolvedBetToSave?.save()

//         resolvedBets.push(resolvedBet)
//       }

//       if (bet.method === WinMethod.SUBMISSION) {
//         const methodIsCorrect = projectedWinner.Submissions > 0
//         const resolvedBet: FightBetDocument = {
//           ...bet,
//           isResolved: true,
//           betResultWin: winnerIsCorrect && methodIsCorrect
//         }
//         const resolvedBetToSave = await FightBetModel.findById(resolvedBet.id)

//         if (resolvedBetToSave) {
//           resolvedBetToSave.isResolved = resolvedBet.isResolved
//           resolvedBetToSave.betResultWin = resolvedBet.betResultWin
//         }

//         const updatedBet = await resolvedBetToSave?.save()
//         resolvedBets.push(resolvedBet)
//       }
//       if (bet.method === WinMethod.KO_TKO) {
//         const methodIsCorrect = projectedWinner.Knockdowns > 0
//         const resolvedBet: FightBetDocument = {
//           ...bet,
//           isResolved: true,
//           betResultWin: winnerIsCorrect && methodIsCorrect
//         }
//         const resolvedBetToSave = await FightBetModel.findById(resolvedBet.id)

//         if (resolvedBetToSave) {
//           resolvedBetToSave.isResolved = resolvedBet.isResolved
//           resolvedBetToSave.betResultWin = resolvedBet.betResultWin
//         }

//         const updatedBet = await resolvedBetToSave?.save()
//         resolvedBets.push(resolvedBet)
//       }
//       if (bet.method === WinMethod.DECISION) {
//         const methodIsCorrect = projectedWinner.DecisionWin === true
//         const resolvedBet: FightBetDocument = {
//           ...bet,
//           isResolved: true,
//           betResultWin: winnerIsCorrect && methodIsCorrect
//         }
//         const resolvedBetToSave = await FightBetModel.findById(resolvedBet.id)

//         if (resolvedBetToSave) {
//           resolvedBetToSave.isResolved = resolvedBet.isResolved
//           resolvedBetToSave.betResultWin = resolvedBet.betResultWin
//         }

//         const updatedBet = await resolvedBetToSave?.save()
//         resolvedBets.push(resolvedBet)
//       }
//       if (bet.method === WinMethod.DQ) {
//         // I assume that if winnerIsCorrect but there is no DecisionWin & nor Submissions nor Knockdowns then it is DQ
//         const methodIsCorrect =
//           projectedWinner.DecisionWin === false &&
//           projectedWinner.Knockdowns === 0 &&
//           projectedWinner.Submissions === 0
//         const resolvedBet: FightBetDocument = {
//           ...bet,
//           isResolved: true,
//           betResultWin: winnerIsCorrect && methodIsCorrect
//         }
//         const resolvedBetToSave = await FightBetModel.findById(resolvedBet.id)

//         if (resolvedBetToSave) {
//           resolvedBetToSave.isResolved = resolvedBet.isResolved
//           resolvedBetToSave.betResultWin = resolvedBet.betResultWin
//         }

//         const updatedBet = await resolvedBetToSave?.save()
//         resolvedBets.push(resolvedBet)
//       }
//       if (bet.method === WinMethod.DRAW) {
//         const fighterOneWin = fightDataById.FightStats[0].Winner
//         const fighterTwoWin = fightDataById.FightStats[1].Winner
//         const methodIsCorrect =
//           fighterOneWin === false && fighterTwoWin === false
//         const resolvedBet: FightBetDocument = {
//           ...bet,
//           isResolved: true,
//           betResultWin: methodIsCorrect
//         }
//         const resolvedBetToSave = await FightBetModel.findById(resolvedBet.id)

//         if (resolvedBetToSave) {
//           resolvedBetToSave.isResolved = resolvedBet.isResolved
//           resolvedBetToSave.betResultWin = resolvedBet.betResultWin
//         }

//         const updatedBet = await resolvedBetToSave?.save()
//         resolvedBets.push(resolvedBet)
//       }
//     })
//   }
//   return resolvedBets
// }

export { getFightData, resolveBetsByFightId }
