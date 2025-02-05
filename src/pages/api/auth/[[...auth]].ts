import type { NextApiRequest, NextApiResponse } from 'next'
import { clerkClient } from '../../../services/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req
  const [action] = query.auth || []

  try {
    switch (action) {
      case 'session':
        if (method === 'GET') {
          const session = await clerkClient.verifySession(
            req.headers['session-id'] as string,
          )
          return res.status(200).json(session)
        }
        break

      case 'sign-in':
        if (method === 'POST') {
          const { identifier, password } = req.body
          const session = await clerkClient.signIn.create({
            identifier,
            password,
          })
          return res.status(200).json(session)
        }
        break

      case 'sign-out':
        if (method === 'POST') {
          await clerkClient.signIn.revoke(
            req.headers['session-id'] as string,
          )
          return res.status(204).end()
        }
        break

      case 'sign-up':
        if (method === 'POST') {
          const { email, password, firstName, lastName } = req.body
          const user = await clerkClient.users.create({
            emailAddress: email,
            password,
            firstName,
            lastName,
          })
          return res.status(201).json(user)
        }
        break

      default:
        return res.status(404).json({ message: 'Not found' })
    }

    return res.status(405).json({ message: 'Method not allowed' })
  }
  catch (error) {
    console.error('Auth API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
