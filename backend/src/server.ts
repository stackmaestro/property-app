import express from 'express';
import dotenv from 'dotenv';
import { appRouter } from './trpc';
import { createExpressMiddleware } from '@trpc/server/adapters/express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    throw error;
  }
};


startServer();