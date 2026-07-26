import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../config/db';
import { env } from '../../config/env';
import { defaultCategories } from '../../utils/defaultCategories';
import * as authRepository from './auth.repository';
import { AuthResponse, RegisterDto, UserResponse } from './auth.types';
import { toUserResponse } from './auth.mapper';
import { AUTH_ERROR_CODES } from './auth.constants';

const signToken = (userId: number) => {
   const token = jwt.sign({ userId }, env.JWT_SECRET, {
      expiresIn: '7d',
   });

   return token;
};

export const register = async (registerDto: RegisterDto): Promise<AuthResponse> => {
   const client = await db.connect();
   // Needed for transactions

   try {
      const existing = await authRepository.findUserByEmail(registerDto.email);

      if (existing) {
         throw new Error(AUTH_ERROR_CODES.EMAIL_EXISTS);
      }

      await client.query('BEGIN');

      const passwordHash = await bcrypt.hash(registerDto.password, 10);

      const user = await authRepository.createUser(client, {
         name: registerDto.name,
         email: registerDto.email,
         passwordHash,
         currency: registerDto.currency ?? 'USD',
      });

      for (const category of defaultCategories) {
         await authRepository.createCategory(client, user.id, category);
      }

      await client.query('COMMIT');

      return {
         user: toUserResponse(user),
         token: signToken(user.id),
      };
   } catch (err: unknown) {
      console.error("Failed to register user. ", err);

      await client.query('ROLLBACK');
      throw err;
   } finally {
      client.release();
      // Returns connection back to db. without this, connections leak, database eventually freezes
   }
};

export const login = async (
   email: string,
   password: string
): Promise<AuthResponse> => {
   const user = await authRepository.findUserByEmail(email);

   if (!user) {
      throw new Error(AUTH_ERROR_CODES.INVALID_CREDENTIALS);
   }

   const valid = await bcrypt.compare(password, user.password_hash);

   if (!valid) {
      throw new Error(AUTH_ERROR_CODES.INVALID_CREDENTIALS);
   }

   return {
      user: toUserResponse(user),
      token: signToken(user.id),
   };
};

export const getMe = async (userId: number): Promise<UserResponse> => {
   const user = await authRepository.findUserById(userId);

   if (!user) {
      throw new Error(AUTH_ERROR_CODES.USER_NOT_FOUND);
   }

   return toUserResponse(user);
};
