import request from 'supertest'
import app from '../../src/server'
import User from '../../models/userModel'
import { disconnect } from './dbHandler'
import mongoose from 'mongoose'
import generateToken from '../../utilities/generateToken'

let existingUserId: string
let adminUserToken: string | undefined

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
  await disconnect()
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

    expect(response.status).toBe(201)

    const user = await User.findOne({ email: newUser.email })

    expect(user).not.toBeNull()
  })
})
describe('PUT /api/users/profile', () => {
  it('updates the user profile', async () => {
    const updatedProfile = {
      name: 'Updated Name',
      email: 'updated@test.com'
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
