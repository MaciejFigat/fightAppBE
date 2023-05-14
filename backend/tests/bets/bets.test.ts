import FightBetModel from '../../models/betModel'
import mongoose, { Types } from 'mongoose'
import User from '../../models/userModel'
import generateToken from '../../utilities/generateToken'
// import { FightBetDocument } from '../../interfaces'

type FightBetDocument = InstanceType<typeof FightBetModel>

let createdBet: FightBetDocument | null = null
let createdId: Types.ObjectId | null = null

beforeAll(async () => {
  const user = new User({
    name: 'Existing User',
    email: 'existing@test.com',
    password: 'test123',
    isAdmin: true
  })
  await user.save()

  let existingUserId = user._id
  console.log(user._id)
  let adminUserToken = 'Bearer ' + generateToken(user._id)

  const BobTheToaster = {
    Active: true,
    FighterId: 123,
    FirstName: 'John',
    LastName: 'Doester',
    Moneyline: 250,
    PreFightDraws: 1,
    PreFightLosses: 2,
    PreFightNoContests: 0,
    PreFightWins: 10,
    Winner: false
  }
  const BobTheTester = {
    Active: true,
    FighterId: 456,
    FirstName: 'Test',
    LastName: 'Johnson',
    Moneyline: 350,
    PreFightDraws: 2,
    PreFightLosses: 3,
    PreFightNoContests: 1,
    PreFightWins: 8,
    Winner: false
  }

  const bet = new FightBetModel({
    user: '6447e0a06d41697e759fc34b',
    id: '1231245151515ewdsfsfsfs',
    name: 'BobTheToaster',
    fightName: 'BobTheToaster vs. BobTheTester',
    method: 'KO/TKO',
    FightId: 1234,
    EventId: 123545,
    activated: true,
    dateTime: '2025-05-01T23:00:00.000Z',
    moneyline: 100,
    Fighters: [BobTheToaster, BobTheTester],
    projectedWinner: 0,
    amountBet: 1,
    expectedPayout: 1
  })

  createdBet = await bet.save()
  createdId = createdBet._id
})

describe('insert', () => {
  it('should find a bet', async () => {
    const betToFind = await FightBetModel.findOne({
      id: '1231245151515ewdsfsfsfs'
    })

    expect(betToFind?._id).toEqual(createdBet?._id)

    await FightBetModel.deleteOne({ id: '1231245151515ewdsfsfsfs' })
    const betThatWasDeleted = await FightBetModel.findOne({
      id: '1231245151515ewdsfsfsfs'
    })
    expect(betThatWasDeleted).toBeNull()
  }, 10000)

  afterAll(async () => {
    await mongoose.connection.close()
  })
})
