import { NextApiRequest, NextApiResponse } from 'next'

describe('TogetLink AI Landing Page', () => {
  it('should return a welcome message', async () => {
    const res = await fetch('/api/ai')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ message: 'Welcome to TogetLink AI Landing Page!' })
  })
})
