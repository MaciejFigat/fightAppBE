import mongoose, { Types, disconnect } from 'mongoose'

// Mock your Models
jest.mock('../../models/betModel')
jest.mock('../../models/userModel')

// Import your mock Models
import FightBetModel from '../../../models/betModel'
import UserModel from '../../../models/userModel'

// Import the function you are testing
import { RequestWithUser, addNewBet } from '../../../controllers/betController' // or wherever you have defined this function
import generateToken from '../../../utilities/generateToken'
import User from '../../../models/userModel'

let existingUserId: string
let adminUserToken: string | undefined

beforeAll(async () => {
  const user = new User({
    name: 'Existing User',
    email: 'existing@test.com',
    password: 'test123',
    isAdmin: true,
    coinsAvailable: 1000
  })
  await user.save()

  existingUserId = user._id
  adminUserToken = 'Bearer ' + generateToken(user._id)
})
afterAll(async () => {
  await mongoose.connection.close()
  await disconnect()
})

describe('addNewBet function', () => {
  it('should create a new bet and reduce user coins', async () => {
    // Mock req
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
    const mockReq: Partial<RequestWithUser> = {
      //   user: {
      //     _id: existingUserId
      //     // _id: new Types.ObjectId(),
      //     // name: 'Test User',
      //     // email: 'test@.gmail.com',
      //     // password: 'stringTest123',
      //     // isAdmin: true,
      //     // status: 'Pending',
      //     // confirmationCode: '1234567890',
      //     // coinsAvailable: 1222
      //   },
      body: {
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
    }

    // Mock res
    const mockRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(), // Ensure this mock returns 'this' for chaining
      json: jest.fn()
    }

    // Mock UserModel.findById
    UserModel.findById = jest.fn().mockResolvedValue({
      _id: mockReq.user?._id,
      coinsAvailable: 10, // Set any initial value
      save: jest.fn()
    })

    // Mock bet.save
    FightBetModel.prototype.save = jest.fn()

    // Call the function with the mocked req and res
    await addNewBet(mockReq as RequestWithUser, mockRes as Response)

    // Assert the function calls
    expect(FightBetModel.prototype.save).toHaveBeenCalled()
    expect(UserModel.findById).toHaveBeenCalledWith(mockReq.user?._id)
    expect(mockRes.status).toHaveBeenCalledWith(201)
    expect(mockRes.json).toHaveBeenCalled()
  })
})
