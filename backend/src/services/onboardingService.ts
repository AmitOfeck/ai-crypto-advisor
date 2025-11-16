import { UserPreferences as UserPreferencesModel, IUserPreferences } from '../models/UserPreferences';
import { UserPreferences, CreateUserPreferencesData } from '../models/UserPreferencesTypes';
import mongoose from 'mongoose';

// Helper function to convert MongoDB document to UserPreferences type
const toUserPreferences = (doc: IUserPreferences): UserPreferences => ({
  id: (doc as any)._id.toString(),
  userId: doc.userId.toString(),
  interestedAssets: doc.interestedAssets,
  investorType: doc.investorType,
  contentPreferences: doc.contentPreferences,
  completedAt: doc.completedAt,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

/**
 * Save or update user preferences
 */
export const savePreferences = async (
  userId: string,
  preferencesData: CreateUserPreferencesData
): Promise<UserPreferences> => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Use upsert to create or update preferences
  const preferences = await UserPreferencesModel.findOneAndUpdate(
    { userId: userObjectId },
    {
      userId: userObjectId,
      interestedAssets: preferencesData.interestedAssets,
      investorType: preferencesData.investorType,
      contentPreferences: preferencesData.contentPreferences,
      completedAt: new Date(),
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return toUserPreferences(preferences);
};

/**
 * Get user preferences by userId
 */
export const getPreferences = async (userId: string): Promise<UserPreferences | null> => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const preferences = await UserPreferencesModel.findOne({ userId: userObjectId });

  if (!preferences) {
    return null;
  }

  return toUserPreferences(preferences);
};

/**
 * Check if user has completed onboarding
 */
export const hasCompletedOnboarding = async (userId: string): Promise<boolean> => {
  const preferences = await getPreferences(userId);
  return preferences !== null;
};

