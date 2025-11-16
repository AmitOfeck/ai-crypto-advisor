// TypeScript interfaces for UserPreferences operations (used by services/controllers)

import { InvestorType, ContentPreference } from './UserPreferences';

export interface UserPreferences {
  id: string;
  userId: string;
  interestedAssets: string[];
  investorType: InvestorType;
  contentPreferences: ContentPreference[];
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserPreferencesData {
  interestedAssets: string[];
  investorType: InvestorType;
  contentPreferences: ContentPreference[];
}

// Re-export enums for convenience
export { InvestorType, ContentPreference };

