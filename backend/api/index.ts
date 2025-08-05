import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../src/trpc';
import { initializeDatabase } from '../src/utils/db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

let dbInitialized = false;

app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
    } catch (error) {
      return res.status(500).json({ error: 'Database initialization failed' });
    }
  }
  next();
});

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
    onError: ({ error}) => {
        throw error
    },
  })
);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message
    });
  }
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;