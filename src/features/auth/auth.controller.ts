import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {db} from '../../config/db';
import { defaultCategories } from '../../utils/defaultCategories';
import { env } from '../../config/env';

const signToken = (userId: number) =>
    jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' });

/**
 * POST /api/auth/register
 * Create a new user, seed default categories, and return a JWT.
 */
export const register = async (req: Request, res: Response) => {
    const { name, email, password, currency = 'USD' } = req.body;

    const client = await db.connect(); // Needed for transactions.
    try {
        const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
         // Parameterized query. Protects against SQL injection

        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        await client.query('BEGIN'); // transactions begin

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userResult = await client.query(
            `INSERT INTO users (name, email, password_hash, currency)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, currency, created_at`,
            [name, email, passwordHash, currency]
        );
        const user = userResult.rows[0];

        for (const cat of defaultCategories) {
            await client.query(
                `INSERT INTO categories (user_id, name, type, icon, color, is_default)
                 VALUES ($1, $2, $3, $4, $5, true)`,
                [user.id, cat.name, cat.type, cat.icon, cat.color]
            );
        }

        await client.query('COMMIT'); // transactions COMMIT, Saves all database changes permanently.

        const token = signToken(user.id); // authentication token

        res.status(201).json({ user, token });
    } catch (error) {
        await client.query('ROLLBACK'); // transactions rollback, Undo database changes, Prevents half-finished data.

        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release(); 
        // Returns connection back to db. without this, connections leak, database eventually freezes
    }
};

import type { Request, Response } from 'express';
/**
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await db.query(
            'SELECT id, name, email, password_hash, currency FROM users WHERE email = $1',
            [email]
        );
        // Looks up user by email.

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        // Checks plain password against hashed password.

        if (!match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user.id);
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                currency: user.currency,
            },
            token,
        });
        // Very important for security. Never return password hash or any sensitive info.

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req: Request, res: Response) => {
    try {
        const result = await db.query(
            'SELECT id, name, email, currency, created_at FROM users WHERE id = $1',
            [req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]); // return profile info, but never return password hash or any sensitive info.
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ message: 'Server error' });
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