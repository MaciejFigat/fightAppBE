 * notes regarding bets resolution
    * 1. get my bets

    * 2. check which bets isResolved === false & isAccepted === true => readyToCheckBets

    * 3. filter those readyToCheckBets if dateTime < Date.now() => filteredBets

    * 4. get sets of FightId from filteredBets - make only minimal amount of calls to API

    * 5. When I have FightId[] I make a call to Api for each FightId and for each call I modify bet in filteredBets


 projectedWinner WinnerProjection

      dateTime < Date.now()
      method WinMethod
      isAccepted === true
      isResolved === false
      FightId
      getFightData(FightId)
        .then(data => {
          console.log(data)
        })
        .catch(error => {
          console.error(error)
        })

      //todo   1. get my bets
      //todo   2. check which bets isResolved === false & isAccepted === true => readyToCheckBets
      //todo   3. filter those readyToCheckBets if dateTime < Date.now() => filteredBets
      //todo   4. get sets of FightId from filteredBets - make only minimal amount of calls to API
      //todo   5. When I have FightId[] I make a call to Api for each FightId and for each call I modify bet in filteredBets
      //*   6. Win Method projectedWinner (ie. 0)
      //*   6.1. Win Method projectedWinner fight from call to API
      //* fight.FightStats[0] Submissions, Knockdowns - lets say its KO/TKO, Winner, DecisionWin

      //? allBetsToResolve => create an array of FightId
      //? I make a call with 1st FightId and filter all the bets with that FightId
      //? for every betWithFightId I check projectedWinner then for fight.FightStats[projectedWinner]
      //* method ANY fight.Winner is true or false
      //? if true then winner of the bet is user._id  - wins expectedPayout to  coinsAvailable
      //? if false then winner of the bet is acceptedBy - wins amountBet to coinsAvailable
      //? method KO_TKO fight.Knockdowns > 0 and Winner === true
      //? method SUBMISSIONS fight.Submissions > 0 and Winner === true
      //? method DECISION_WIN fight.DecisionWin === true and Winner === true
      //todo   8. change bet to isResolved === true and save it

      //todo 9. do for every bet with FightId of the current api call
      //todo 10. I call next api call with next FightId
      //todo repeat for all FightId
      all bets are then to replace the bets received from the call to the DB


      betResultWin?: boolean added in the bet model