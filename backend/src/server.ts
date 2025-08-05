import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './trpc';
import { initializeDatabase } from './utils/db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
    onError: ({ error }) => {
      throw error;
    },
  })
);

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message
    });
  }
  res.status(500).json({ message: 'Something went wrong!' });
});

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    throw error;
  }
};


startServer();