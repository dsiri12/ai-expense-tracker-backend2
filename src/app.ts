import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import authRoutes from './features/auth/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
   res.json({ message: 'AI Expense Tracker API is running' });
});

app.use("/api/v1/auth", authRoutes);

export default app;
