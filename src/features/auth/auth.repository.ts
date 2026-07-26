import type { PoolClient } from 'pg';
import { db } from '../../config/db';
import { CreateUserData, UserEntity } from './auth.types';

export const findUserByEmail = async (email: string) => {
   const result = await db.query<UserEntity>(
      `SELECT id,
                    name,
                    email,
                    password_hash,
                    currency, 
                    created_at
             FROM users
             WHERE email = $1`,
      [email]
   );
   // Parameterized query. Protects against SQL injection

   return result.rows[0] ?? null;
};

export const findUserById = async (id: number) => {
   const result = await db.query<UserEntity>(
      `SELECT id,
                    name,
                    email,
                    password_hash,
                    currency,
                    created_at
             FROM users
             WHERE id = $1`,
      [id]
   );

   return result.rows[0] ?? null;
};

export const createUser = async (client: PoolClient, user: CreateUserData) => {
   const result = await client.query<UserEntity>(
      `INSERT INTO users
                (name, email, password_hash, currency)
             VALUES
                ($1,$2,$3,$4)
             RETURNING id,
                       name,
                       email,
                       password_hash,
                       currency,
                       created_at `,
      [user.name, user.email, user.passwordHash, user.currency]
   );

   return result.rows[0];
};

export const createCategory = async (
   client: PoolClient,
   userId: number,
   category: {
      name: string;
      type: string;
      icon: string;
      color: string;
   }
) => {
   await client.query(
      `INSERT INTO categories
                (user_id,name,type,icon,color,is_default)
             VALUES
                ($1,$2,$3,$4,$5,true)`,
      [userId, category.name, category.type, category.icon, category.color]
   );
};


// The responsibilities are:

// Repository → Returns database entities (UserEntity).
// Service → Converts entities into API response models (UserResponse) and applies business logic.
// Controller → Sends the HTTP response.