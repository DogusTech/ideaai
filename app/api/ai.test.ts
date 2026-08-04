// Import existing API routes
import { NextApiRequest, NextApiResponse } from 'next'
import { handler } from './ai'

describe('AI endpoint', () => {
  it('should return a 200 status', async () => {
    const req = {} as NextApiRequest
    const res = {} as NextApiResponse
    await handler(req, res)
    expect(res.statusCode).toBe(200)
  })
})