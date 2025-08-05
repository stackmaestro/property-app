import { AppDataSource } from "../data-source";
import { Property } from "../entities/Property";
import { TenantProfile } from "../entities/TenantProfile";
import { Amenity } from "../entities/Amenity";
import dotenv from 'dotenv';
import { amenities } from "../constants/mock_amenities";

dotenv.config();

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      await seedAmenities();
      console.log("Database Connected")
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    throw new Error(`Database initialization failed: ${errorMessage}`);
  }
};

const seedAmenities = async () => {
  try {
    const amenityRepository = AppDataSource.getRepository(Amenity);
    const count = await amenityRepository.count();
    
    if (count === 0) {
      const savedAmenities = await amenityRepository.save(amenities);
      return savedAmenities;
    }
  } catch (error) {
    throw new Error(`Failed to seed amenities: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getPropertyRepository = () => {
  try {
    return AppDataSource.getRepository(Property);
  } catch (error) {
    throw new Error('Failed to get Property repository');
  }
};

export const getTenantProfileRepository = () => {
  try {
    return AppDataSource.getRepository(TenantProfile);
  } catch (error) {
    throw new Error('Failed to get TenantProfile repository');
  }
};

export const getAmenityRepository = () => {
  try {
    return AppDataSource.getRepository(Amenity);
  } catch (error) {
    throw new Error('Failed to get Amenity repository');
  }
};