import { AppDataSource } from "../data-source";
import dotenv from 'dotenv';

dotenv.config();

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database Connected")
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    throw new Error(`Database initialization failed: ${errorMessage}`);
  }
};
