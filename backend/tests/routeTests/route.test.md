import request from 'supertest'
import app from '../../src/server'

describe('GET /', () => {
  it('responds with API is running', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
  
    expect(response.body).toEqual({ message: 'API is running' })
  })
})
