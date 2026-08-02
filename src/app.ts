import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import authRoutes from './features/auth/auth.routes';
import categoryRoutes from './features/category/category.routes'
import { errorHandler } from './common/errors/errorHandler';
import { apiLimiter } from './middlewares/apiRateLimiter.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/', apiLimiter);

app.get('/ping', (req: Request, res: Response) => {
   res.json({ message: 'AI Expense Tracker API is running' });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);

app.use(errorHandler);

export default app;
