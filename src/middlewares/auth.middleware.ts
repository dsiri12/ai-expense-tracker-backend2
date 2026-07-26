import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';

interface TokenPayload extends JwtPayload {
   userId: string;
}

export const authenticate = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   // JWTs are commonly sent as:Bearer <token>
   // Authorization: Bearer eyJhbGciOi...

   // Reads HTTP Authorization header.
   const authHeader = req.headers.authorization;
   // authHeader = "Bearer eyJhbGciOi..."

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
      // Stops request immediately.
   }

   // eyJhbGciOi...
   const token = authHeader.split(' ')[1];

   try {
      const jwtPayload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      // { userId: 123 }

      req.userId = jwtPayload.userId;

      next();
      // passes control to the next middleware/route.
      // Without next(), request hangs forever
   } catch (error: unknown) {
      console.log('faile to auth, error');

      return res.status(401).json({ message: 'Not authorised, token failed' });
   }
};



/*
This middleware ensures:

✅ only logged-in users access protected routes
✅ expired tokens rejected
✅ fake tokens rejected
✅ user identity available everywhere

ts:

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}
  */

/*
req.userId
[req.userId]

Comes from authentication middleware.

Usually middleware:

reads JWT token
verifies token
extracts userId
attaches to request
*/
