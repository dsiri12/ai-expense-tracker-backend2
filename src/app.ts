import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
   res.json({ message: 'AI Expense Tracker API is running' });
});

export default app;
