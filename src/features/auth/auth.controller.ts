import type { Request, Response } from 'express';
import * as authService from './auth.service';
import { AUTH_ERROR_CODES, AUTH_ERROR_MESSAGES } from './auth.constants';

/**
 * POST /api/auth/register
 * Create a new user, seed default categories, and return a JWT.
 */
export const register = async (req: Request, res: Response) => {
   const { name, email, password, currency } = req.body;

   try {
      const result = await authService.register({
         name,
         email,
         password,
         currency,
      });

      res.status(201).json(result);
   } catch (err: unknown) {
      if (
         err instanceof Error &&
         err.message === AUTH_ERROR_CODES.EMAIL_EXISTS
      ) {
         return res.status(400).json({
            message: AUTH_ERROR_MESSAGES.EMAIL_EXISTS,
         });
      }

      console.error(err);

      res.status(500).json({
         message: AUTH_ERROR_MESSAGES.SERVER_ERROR,
      });
   }
};

/**
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
   const { email, password } = req.body;

   try {
      const result = await authService.login(email, password);

      res.json(result);
   } catch (err: unknown) {
      if (
         err instanceof Error &&
         err.message === AUTH_ERROR_CODES.INVALID_CREDENTIALS
      ) {
         return res.status(401).json({
            message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
         });
      }

      console.error(err);

      res.status(500).json({
         message: AUTH_ERROR_MESSAGES.SERVER_ERROR,
      });
   }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req: Request, res: Response) => {
   try {
      const user = await authService.getMe(req.userId!);

      res.json(user);
   } catch (err: unknown) {
      if (
         err instanceof Error &&
         err.message === AUTH_ERROR_CODES.USER_NOT_FOUND
      ) {
         return res.status(404).json({
            message: AUTH_ERROR_MESSAGES.USER_NOT_FOUND,
         });
      }

      console.error(err);

      res.status(500).json({
         message: AUTH_ERROR_MESSAGES.SERVER_ERROR,
      });
   }
};

/*
Register
--------
User submits form
→ validate input
→ hash password
→ insert user
→ insert categories
→ create JWT
→ return token

Login
-----
User submits credentials
→ find user
→ compare password
→ create JWT
→ return token

GetMe
-----
Frontend sends JWT
→ middleware verifies token
→ get user from DB
→ return profile

*****
Important Security Features

This code correctly uses:

password hashing
JWT authentication
SQL parameterization
transactions
password hiding
error handling
connection releasing

These are all best practices for backend authentication systems.
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
