import request from 'supertest'
import app from '../../../src/server'
import User from '../../../models/userModel'
import mongoose, { Types } from 'mongoose'
import generateToken from '../../../utilities/generateToken'

let existingUserId: string
let adminUserToken: string | undefined
let userTestId: Types.ObjectId | null = null

beforeAll(async () => {
  const user = new User({
    name: 'Existing User',
    email: 'existing@test.com',
    password: 'test123',
    isAdmin: true
  })
  await user.save()

  existingUserId = user._id
  adminUserToken = 'Bearer ' + generateToken(user._id)
})

afterAll(async () => {
  await mongoose.connection.close()
  await mongoose.disconnect()
})

describe('GET /', () => {
  it('responds with API is running', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)

    expect(response.body).toEqual({ message: 'API is running' })
  })
})

describe('GET /api/users/:id', () => {
  it('retrieves the user by id', async () => {
    const response = await request(app)
      .get(`/api/users/${existingUserId}`)
      .set(
        'Authorization',
        adminUserToken ? adminUserToken : 'Bearer ' + generateToken('')
      )

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(existingUserId.toString())
  })
})

describe('POST /api/users', () => {
  it('creates a new user', async () => {
    const newUser = {
      name: 'Test 2 User',
      email: 'test@test.com',
      password: 'test123'
    }

    const response = await request(app).post('/api/users').send(newUser)

    userTestId = response.body._id

    expect(response.status).toBe(201)

    const user = await User.findOne({ email: newUser.email })

    expect(user).not.toBeNull()
  })
})
describe('PUT /api/users/profile', () => {
  it('updates the user profile', async () => {
    const updatedProfile = {
      name: 'Updated Name',
      email: 'updated@test.com',
      coinsAvailable: 2000
    }

    const response = await request(app)
      .put('/api/users/profile')
      .set(
        'Authorization',
        adminUserToken ? adminUserToken : 'Bearer ' + generateToken('')
      )
      .send(updatedProfile)

    expect(response.status).toBe(200)
    expect(response.body.name).toBe(updatedProfile.name)
    expect(response.body.email).toBe(updatedProfile.email)
  })
})

describe('DELETE /api/users/:id', () => {
  it('delete user by id', async () => {
    const response = await request(app)
      .delete(`/api/users/${userTestId}`)
      .set(
        'Authorization',
        adminUserToken ? adminUserToken : 'Bearer ' + generateToken('')
      )

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('User removed')
  })
})
describe('DELETE /api/users/:id', () => {
  it('fail to delete non existing user by id', async () => {
    const response = await request(app)
      .delete(`/api/users/${userTestId}`)
      .set(
        'Authorization',
        adminUserToken ? adminUserToken : 'Bearer ' + generateToken('')
      )
    console.log(response.body.message)
    expect(response.status).toBe(404)
    expect(response.body.message).toBe('User not found')
  })
})
let betId: Types.ObjectId | null = null

describe('POST /api/bets/', () => {
  it('user adds bet succesfully', async () => {
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

    const newBet = {
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
    }

    const response = await request(app)
      .post('/api/bets/')
      .set(
        'Authorization',
        adminUserToken ? adminUserToken : 'Bearer ' + generateToken('')
      )
      .send(newBet)

    betId = response.body._id
    expect(response.status).toBe(201)
    expect(response.body.name).toBe(newBet.name)
    expect(response.body.FightId).toBe(newBet.FightId)
  })
})
describe('GET /api/bets/mybets', () => {
  it('user finds his bet', async () => {
    const response = await request(app)
      .get('/api/bets/mybets')
      .set(
        'Authorization',
        adminUserToken ? adminUserToken : 'Bearer ' + generateToken('')
      )

    expect(response.status).toBe(200)
    expect(response.body[0]._id).toBe(betId)
  })
})
describe('DELETE /api/bets/:id', () => {
  it('delete bet by id', async () => {
    const response = await request(app)
      .delete(`/api/bets/${betId}`)
      .set(
        'Authorization',
        adminUserToken ? adminUserToken : 'Bearer ' + generateToken('')
      )

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(betId)
    expect(response.body.message).toBe('Bet removed')
  })
})
