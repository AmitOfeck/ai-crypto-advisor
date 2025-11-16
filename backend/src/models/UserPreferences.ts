import mongoose, { Schema, Document } from 'mongoose';

// Investor types enum
export enum InvestorType {
  HODLER = 'HODLer',
  DAY_TRADER = 'Day Trader',
  NFT_COLLECTOR = 'NFT Collector',
  SWING_TRADER = 'Swing Trader',
  DEFI_INVESTOR = 'DeFi Investor',
  OTHER = 'Other',
}

// Content preference types
export enum ContentPreference {
  MARKET_NEWS = 'Market News',
  CHARTS = 'Charts',
  SOCIAL = 'Social',
  FUN = 'Fun',
}

// MongoDB UserPreferences Document interface
export interface IUserPreferences extends Document {
  userId: mongoose.Types.ObjectId;
  interestedAssets: string[]; // Array of crypto asset names/symbols
  investorType: InvestorType;
  contentPreferences: ContentPreference[];
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// UserPreferences Schema
const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    interestedAssets: {
      type: [String],
      required: true,
      default: [],
    },
    investorType: {
      type: String,
      enum: Object.values(InvestorType),
      required: true,
    },
    contentPreferences: {
      type: [String],
      enum: Object.values(ContentPreference),
      required: true,
      default: [],
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Export UserPreferences model
export const UserPreferences = mongoose.model<IUserPreferences>(
  'UserPreferences',
  UserPreferencesSchema
);

