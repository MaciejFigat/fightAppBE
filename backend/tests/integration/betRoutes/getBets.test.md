import mongoose, { Types, disconnect } from 'mongoose'
import request from 'supertest'
import express from 'express'
import app from '../../../src/server'
import User from '../../../models/userModel'
import generateToken from '../../../utilities/generateToken'
import FightBetModel from '../../../models/betModel'

// let testUserUserId: string
let testUserToken: string | undefined
let testUserId: Types.ObjectId | null = null
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

beforeAll(async () => {
  const user = new User({
    name: 'Existing User',
    email: 'existing@test.com',
    password: 'test123',
    isAdmin: true
  })
  const testUser = await user.save()
  //   testUserId = testUser._id
  testUserId = user._id
  testUserToken = 'Bearer ' + generateToken(user._id)

  await FightBetModel.deleteMany({})
  await FightBetModel.create({
    user: user._id,
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
})
afterAll(async () => {
  await mongoose.connection.close()
  await disconnect()
})

describe('getMyBets', () => {
  it('should get all bets of the user', async () => {
    const res = await request(app)
      .get('/bets')
      .set(
        'Authorization',
        testUserToken ? testUserToken : 'Bearer ' + generateToken('')
      ) // Assuming you're using user in headers

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveLength(1) // Expect 1 bet in the result as per beforeEach setup
    expect(res.body[0].user).toEqual(String(testUserId))
  })
})
