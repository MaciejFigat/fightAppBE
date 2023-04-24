import jwt, { JwtPayload } from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User, { UserDocument } from '../models/userModel'
import { Request, Response, NextFunction } from 'express'

interface RequestWithUser extends Request {
  user?: (UserDocument & { _id: string }) | null
}

const protect = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token: string | undefined

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1]

        const decoded = jwt.verify(
          token,
          `${process.env.JWT_SECRET}`
        ) as JwtPayload

        const user = await User.findById(decoded.id).select('-password')
        req.user = user ? user.toObject() : null

        next()
      } catch (error) {
        console.error(error)
        res.status(401)
        throw new Error('Not authorized, token failed')
      }
    }

    if (!token) {
      res.status(401)
      throw new Error('Not authorized, no token provided')
    }
  }
)

const admin = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

export { protect, admin }
