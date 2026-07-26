import express from 'express';
import { register, login, getMe } from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from "../../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "./auth.validator";

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);

export default router;

/*
Why This Structure is Good

It separates responsibilities:

File	      Responsibility
routes	    URL endpoints
controllers	business logic
middleware	reusable request logic

This makes backend:

cleaner
scalable
easier to maintain
*/